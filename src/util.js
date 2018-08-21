function time(ms) {
	return new Promise((resolve, reject) => {
	  setTimeout(resolve, ms);
	});
  }
module.exports  = {
	time
}
