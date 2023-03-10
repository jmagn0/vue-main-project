import axios from 'axios';

export default {
    async registerCoach(context, payload){
        const userId = context.rootGetters.userId;
        const coachData = {
            firstName: payload.first,
            lastName: payload.last,
            description: payload.desc,
            hourlyPrice: payload.price,
            areas: payload.areas,
        };

        const response = await axios.put(`https://vue-http-coache-default-rtdb.firebaseio.com/coaches/${userId}.json`, JSON.stringify(coachData));
        console.log(response);
        
        context.commit('addCoach', {
            ...coachData,
            id: userId
        });
    },
    async loadCoaches(context, payload){
        if(!payload.forceRefresh && !context.getters.shouldUpdate){
            return;
        }
        const response = await axios.get('https://vue-http-coache-default-rtdb.firebaseio.com/coaches.json');

        const responseData = await response.data;

        if (response.status < 200 || response.status >= 300) {
            const error = new Error('Failed to fetch');
            throw error;
        }


        const coaches = [];

        for(const key in responseData){
            const coach = {
                id: key,
                firstName: responseData[key].firstName,
                lastName: responseData[key].lastName,
                description: responseData[key].description,
                hourlyPrice: responseData[key].hourlyPrice,
                areas: responseData[key].areas,
            };

            coaches.push(coach);
        }

        context.commit('setCoaches', coaches);
        context.commit('setFetchTimestamp');
    }
};