var fs = require('fs');

class File {

  constructor(username, genName, file) {
    this.filename = file.name;
    this.genName  = genName;
    this.type     = file.type;
    this.size     = file.size;
    this.path     = file.path;
    this.username = username;
  }

  isImage() {
    const imgExt = ['image/jpg', 'image/jpeg', 'image/gif', 'image/png'];
    if ( imgExt.includes(this.type) ) {
      const imageFile = fs.readFileSync(this.path);
      const img64 = Buffer.from(imageFile).toString('base64');
      return { isImage: true, image: img64, type: this.type };
    } 
  }

}

module.exports = File;