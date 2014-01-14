/*
 * GET home page.
 */
module.exports = function(app){
	app.get('/',function(req,res){
    // res.render('index', { 
    //   title:"测试"
    // });
    res.render('index', {
        title:"测试"
      },function (err, str) {
      //res.setHeader('content-type', 'text/html; charset=utf-8')
      res.write(str)
      // res.write('<section id="s1"></section><section id="s2"></section>')
    })
    var data={is:"true"};
    setTimeout(function(){
      res.write('<script>bigpipe.set("test",'+JSON.stringify(data)+');</script>');
      res.end();
    }, 5000);
  });
}