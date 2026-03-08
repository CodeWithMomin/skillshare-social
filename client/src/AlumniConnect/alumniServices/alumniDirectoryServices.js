import alumniapi from '../../services/alumniapi'

const alumniDirectoryServices = {
    getAllAlumni: async () => {
        try {
            const response = await alumniapi.get('/alumni/directory');
            return response;
        } catch (error) {
            console.error('Error fetching alumni directory:', error);
            return { success: false, error: error.message };
        }
    },
    searchAlumniByCity: async (city) => {
        try {
            const normalizedCity = city.toLowerCase();
            const response = await alumniapi.get(`/alumni/search-city?city=${normalizedCity}`);
            return response;
        } catch (error) {
            console.error('Error searching alumni by city:', error);
            return { success: false, error: error.message };
        }
    },
    searchAlumniByDomain: async (domain) => {
        try {
            const normalizedDomain = domain.toLowerCase();
            const response = await alumniapi.get(`/alumni/search-domain?domain=${normalizedDomain}`);
            return response;
        } catch (error) {
            console.error('Error searching alumni by domain:', error);
            return { success: false, error: error.message };
        }
    },
    searchAlumniBatchmates: async (degree, university, enrollmentYear) => {
        try {
            const response = await alumniapi.get(`/alumni/search-batchmates`, {
                params: {
                    degree,
                    university,
                    enrollmentYear
                }
            });
            return response;
        } catch (error) {
            console.error('Error searching alumni batchmates:', error);
            return { success: false, error: error.message };
        }
    }
};

export default alumniDirectoryServices;
