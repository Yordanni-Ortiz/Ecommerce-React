const getConfig = () => {
    const token = localStorage.getItem("token");
    console.log("Token from localStorage:", token);
  
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };
  
  export default getConfig;