import axios from "axios";

const fetchNumbers = async () => {
    try{
        const response = await axios.get("https://api.sms-man.com/control/get-balance", {
            params: {
                token: 'n9n82gdNHLOPB8u7bUQyt0Owse4CqSip',
            },
        });
        console.log(response.data);
    } catch(error){
        console.error("Error loading API", error)
    }
}