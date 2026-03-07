import React, { useEffect, useRef, useState } from "react";
import { Box, Avatar, Typography, IconButton, Tooltip } from "@mui/material";
import { Call, CallEnd, Videocam, VideocamOff, Mic, MicOff, VolumeUp, VolumeOff } from "@mui/icons-material";
import socket from "../socket";

// Google's free public STUN servers
const ICE_SERVERS = {
    iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
    ],
};

const VideoCall = ({ callState, onCallEnd, myUserId }) => {
    const {
        isIncoming,
        isOutgoing,
        callType,    // "video" | "audio"
        caller,      // { userId, name, profilePic }
        callee,      // { userId, name, profilePic }
        offer,       // RTCSessionDescription offer (for incoming)
    } = callState;

    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const remoteAudioRef = useRef(null); // dedicated audio element for audio-only calls
    const pcRef = useRef(null);
    const localStreamRef = useRef(null);

    const [isMuted, setIsMuted] = useState(false);
    const [isCamOff, setIsCamOff] = useState(false);
    const [isSpeakerOff, setIsSpeakerOff] = useState(false);
    const [callDuration, setCallDuration] = useState(0);
    const [isConnected, setIsConnected] = useState(false);
    const timerRef = useRef(null);

    // ─── Helpers ────────────────────────────────────────────────────────────────

    const stopAllTracks = () => {
        localStreamRef.current?.getTracks().forEach(t => t.stop());
    };

    const cleanup = () => {
        stopAllTracks();
        pcRef.current?.close();
        pcRef.current = null;
        clearInterval(timerRef.current);
    };

    // ─── Start local media ───────────────────────────────────────────────────────

    const startLocalMedia = async () => {
        try {
            const constraints = {
                audio: true,
                video: callType === "video" ? { width: 1280, height: 720 } : false,
            };
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            localStreamRef.current = stream;
            if (localVideoRef.current) localVideoRef.current.srcObject = stream;
            return stream;
        } catch (err) {
            console.error("Media access denied:", err);
            onCallEnd();
        }
    };

    // ─── Build PeerConnection ────────────────────────────────────────────────────

    const createPeerConnection = (remoteUserId) => {
        const pc = new RTCPeerConnection(ICE_SERVERS);
        pcRef.current = pc;

        // Send ICE candidates to the other peer via Socket.IO
        pc.onicecandidate = (e) => {
            if (e.candidate) {
                socket.emit("iceCandidate", { to: remoteUserId, candidate: e.candidate });
            }
        };

        // When we receive remote tracks, attach stream to BOTH video and audio elements
        pc.ontrack = (e) => {
            const stream = e.streams[0];
            // For video calls: attach to the video element (carries both audio+video)
            if (remoteVideoRef.current && callType === "video") {
                remoteVideoRef.current.srcObject = stream;
            }
            // Always attach to hidden audio element so sound plays in both call types
            if (remoteAudioRef.current) {
                remoteAudioRef.current.srcObject = stream;
            }
        };

        return pc;
    };

    // ─── Outgoing call: create offer ────────────────────────────────────────────

    const startOutgoingCall = async () => {
        const stream = await startLocalMedia();
        if (!stream) return;

        const pc = createPeerConnection(callee.userId);

        stream.getTracks().forEach(track => pc.addTrack(track, stream));

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        socket.emit("callUser", {
            to: callee.userId,
            from: myUserId,
            caller,
            callType,
            offer: pc.localDescription,
        });
    };

    // ─── Incoming call: create answer ───────────────────────────────────────────

    const answerCall = async () => {
        const stream = await startLocalMedia();
        if (!stream) return;

        const pc = createPeerConnection(caller.userId);
        stream.getTracks().forEach(track => pc.addTrack(track, stream));

        await pc.setRemoteDescription(new RTCSessionDescription(offer));

        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        socket.emit("callAccepted", { to: caller.userId, answer: pc.localDescription });

        // Transition receiver to active connected state
        setIsConnected(true);
        timerRef.current = setInterval(() => setCallDuration(d => d + 1), 1000);
    };

    // ─── End / reject call ──────────────────────────────────────────────────────

    const hangUp = () => {
        const remoteId = isIncoming ? caller?.userId : callee?.userId;
        socket.emit("callEnded", { to: remoteId });
        cleanup();
        onCallEnd();
    };

    const rejectCall = () => {
        socket.emit("callRejected", { to: caller.userId });
        onCallEnd();
    };

    // ─── Socket listeners ────────────────────────────────────────────────────────

    useEffect(() => {
        // Answer was sent back to us (outgoing → active)
        socket.on("callAnswered", async ({ answer }) => {
            if (pcRef.current) {
                await pcRef.current.setRemoteDescription(new RTCSessionDescription(answer));
                setIsConnected(true); // caller transitions to active
                timerRef.current = setInterval(() => setCallDuration(d => d + 1), 1000);
            }
        });

        socket.on("iceCandidate", async ({ candidate }) => {
            try {
                if (pcRef.current && candidate) {
                    await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
                }
            } catch (e) { console.error(e); }
        });

        socket.on("callEnded", () => { cleanup(); onCallEnd(); });
        socket.on("callRejected", () => { cleanup(); onCallEnd(); });

        return () => {
            socket.off("callAnswered");
            socket.off("iceCandidate");
            socket.off("callEnded");
            socket.off("callRejected");
        };
    }, []);

    // ─── Auto-start outgoing call media ─────────────────────────────────────────

    useEffect(() => {
        if (isOutgoing) startOutgoingCall();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ─── Cleanup on unmount ──────────────────────────────────────────────────────

    useEffect(() => () => cleanup(), []);

    // ─── Controls ───────────────────────────────────────────────────────────────

    const toggleMute = () => {
        if (localStreamRef.current) {
            localStreamRef.current.getAudioTracks().forEach(t => { t.enabled = !t.enabled; });
            setIsMuted(m => !m);
        }
    };

    const toggleCamera = () => {
        if (localStreamRef.current) {
            localStreamRef.current.getVideoTracks().forEach(t => { t.enabled = !t.enabled; });
            setIsCamOff(c => !c);
        }
    };

    const toggleSpeaker = () => {
        // Mute/unmute the remote audio output
        if (remoteAudioRef.current) {
            remoteAudioRef.current.muted = !remoteAudioRef.current.muted;
        }
        if (remoteVideoRef.current) {
            remoteVideoRef.current.muted = !remoteVideoRef.current.muted;
        }
        setIsSpeakerOff(s => !s);
    };

    const formatDuration = (s) =>
        `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

    // ─── UI ─────────────────────────────────────────────────────────────────────

    const person = isIncoming ? caller : callee;

    return (
        <Box sx={{
            position: "fixed", inset: 0, zIndex: 20000,
            background: callType === "video" ? "#0d1117" : "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            color: "#fff",
        }}>

            {/* ── REMOTE VIDEO (background) ── */}
            {callType === "video" && (
                <video
                    ref={remoteVideoRef}
                    autoPlay
                    playsInline
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.9 }}
                />
            )}

            {/* ── HIDDEN AUDIO ELEMENT — always present to play remote voice ── */}
            <audio ref={remoteAudioRef} autoPlay playsInline style={{ display: "none" }} />

            {/* ── DARK OVERLAY ── */}
            <Box sx={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)" }} />

            {/* ── LOCAL VIDEO (picture-in-picture) ── */}
            {callType === "video" && (
                <Box sx={{
                    position: "absolute", bottom: 120, right: 20,
                    width: 140, height: 200, borderRadius: 3,
                    overflow: "hidden", border: "2px solid rgba(255,255,255,0.3)",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                    zIndex: 1,
                }}>
                    <video ref={localVideoRef} autoPlay muted playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </Box>
            )}

            {/* ── MAIN CONTENT ── */}
            <Box sx={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                <Avatar
                    src={person?.profilePic}
                    sx={{ width: 100, height: 100, border: "3px solid rgba(255,255,255,0.5)", boxShadow: "0 0 30px rgba(255,255,255,0.2)" }}
                />
                <Typography variant="h5" fontWeight="bold">{person?.name}</Typography>

                {/* Status line */}
                {isIncoming && !isConnected && (
                    <Typography variant="body1" sx={{ opacity: 0.8 }}>
                        {callType === "video" ? "📹 Incoming video call..." : "📞 Incoming audio call..."}
                    </Typography>
                )}
                {isOutgoing && !isConnected && (
                    <Typography variant="body1" sx={{ opacity: 0.8, animation: "pulse 1.5s infinite" }}>
                        Ringing...
                    </Typography>
                )}
                {isConnected && (
                    <Typography variant="body2" sx={{ opacity: 0.8, fontFamily: "monospace", fontSize: 16 }}>
                        {formatDuration(callDuration)}
                    </Typography>
                )}
            </Box>

            {/* ── CALL CONTROLS ── */}
            <Box sx={{
                position: "absolute", bottom: 40, zIndex: 1,
                display: "flex", gap: 3, alignItems: "center"
            }}>

                {/* INCOMING: Show Accept + Reject buttons */}
                {isIncoming && !isConnected && (
                    <>
                        <Tooltip title="Reject">
                            <IconButton onClick={rejectCall} sx={{ bgcolor: "#e53935", color: "#fff", width: 64, height: 64, "&:hover": { bgcolor: "#c62828" } }}>
                                <CallEnd sx={{ fontSize: 30 }} />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Accept">
                            <IconButton onClick={answerCall} sx={{ bgcolor: "#43a047", color: "#fff", width: 64, height: 64, "&:hover": { bgcolor: "#2e7d32" } }}>
                                <Call sx={{ fontSize: 30 }} />
                            </IconButton>
                        </Tooltip>
                    </>
                )}

                {/* OUTGOING / ACTIVE controls */}
                {(isOutgoing || isConnected) && (
                    <>
                        <Tooltip title={isMuted ? "Unmute mic" : "Mute mic"}>
                            <IconButton onClick={toggleMute} sx={{ bgcolor: isMuted ? "#e53935" : "rgba(255,255,255,0.2)", color: "#fff", width: 56, height: 56, "&:hover": { bgcolor: isMuted ? "#c62828" : "rgba(255,255,255,0.35)" } }}>
                                {isMuted ? <MicOff /> : <Mic />}
                            </IconButton>
                        </Tooltip>

                        <Tooltip title={isSpeakerOff ? "Turn on speaker" : "Turn off speaker"}>
                            <IconButton onClick={toggleSpeaker} sx={{ bgcolor: isSpeakerOff ? "#e53935" : "rgba(255,255,255,0.2)", color: "#fff", width: 56, height: 56, "&:hover": { bgcolor: isSpeakerOff ? "#c62828" : "rgba(255,255,255,0.35)" } }}>
                                {isSpeakerOff ? <VolumeOff /> : <VolumeUp />}
                            </IconButton>
                        </Tooltip>

                        {callType === "video" && (
                            <Tooltip title={isCamOff ? "Turn on camera" : "Turn off camera"}>
                                <IconButton onClick={toggleCamera} sx={{ bgcolor: isCamOff ? "#e53935" : "rgba(255,255,255,0.2)", color: "#fff", width: 56, height: 56, "&:hover": { bgcolor: isCamOff ? "#c62828" : "rgba(255,255,255,0.35)" } }}>
                                    {isCamOff ? <VideocamOff /> : <Videocam />}
                                </IconButton>
                            </Tooltip>
                        )}

                        <Tooltip title="End call">
                            <IconButton onClick={hangUp} sx={{ bgcolor: "#e53935", color: "#fff", width: 64, height: 64, "&:hover": { bgcolor: "#c62828" } }}>
                                <CallEnd sx={{ fontSize: 30 }} />
                            </IconButton>
                        </Tooltip>
                    </>
                )}
            </Box>

            <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
      `}</style>
        </Box>
    );
};

export default VideoCall;
