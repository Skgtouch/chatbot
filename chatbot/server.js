var app = require('express')();

app.get('/',function(req,res){
	res.send('Helllloooooo Wolrd');
});

var PORT = 3000;

app.listen(PORT,function(){
	
	console.log('Server is running on : ' +PORT);
});