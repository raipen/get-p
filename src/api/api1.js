function api1(app){
    app.get("/",(request,response)=>{
        response.send("api1 excute");
    });
}
module.exports = api1;