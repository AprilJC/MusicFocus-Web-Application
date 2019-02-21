
const music = require('music-api');
var fs = require('fs');
var stream = fs.createWriteStream("music.json", {flags:'a'});

music.searchAlbum('qq', { key:'bigbang',
  limit: 20,
  page:1}).then(res => {
        if(res.success){
            const len = res;
            stream.write(JSON.stringify(len,null,2) + ",\n");}
  })
    .catch(err => console.log(err))

