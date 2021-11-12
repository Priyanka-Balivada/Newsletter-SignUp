const express = require("express");
const app = express();
const https = require("https");
app.use(express.urlencoded({
  extented: true
}));

app.use(express.static("public"));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html")
})

app.post("/", function(req,res){
  const firstName=req.body.fName;
  const lastName=req.body.lName;
  const email=req.body.email;

  const data={
    members:[
      {
        email_address: email,
        status: "subscribed",
        merge_fields:{
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };
  const jsonData=JSON.stringify(data);
  const url="https://us6.api.mailchimp.com/3.0/lists/26ba518a4e";
  const options={
    method: "POST",
    auth: "priyanka:243321977e032682a612d376b092aaa4-us6"
  }
  const request=https.request(url , options , function(response){
   const code=response.statusCode;

   if(code===200){
     res.sendFile(__dirname + "/success.html");
   }
     else{
       res.sendFile(__dirname + "/failure.html");
   }
  response.on("data",function(data){
    console.log(JSON.parse(data));
  })
  })
  request.write(jsonData);
  request.end();
});

app.post("/failure",function(req,res){
  res.redirect("/");
})

app.listen(process.env.PORT || 3000, function() {
  console.log("Server Started");
})
