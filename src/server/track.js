

module.exports = {
 _encode: function encodeTracks (tracks) {
  function encodeColumns (cols) {
   var encoded = '';
   for (var col in cols) {
    var binaryCol = '';

    for (var cell in cols[col]) {
     binaryCol += cols[col][cell].active == true ? '1' : '0';
    }

    encoded += parseInt(binaryCol, 2).toString(36) + ' ';
   }
   return encoded.trim();
  }

  return tracks.map((t) => {
   t.columns = encodeColumns(t.columns);
   return t;
  });
 },
 _decode: function decodeTracks (tracks) {
  function decodeColumns(cols) {
   var decodedColumns = [];
   var encodedColumns = cols.split(' ');
   for (var encodedCol in encodedColumns) {
    var newCol = [];

    binaryCol = parseInt(encodedColumns[encodedCol], 36).toString(2);
    binaryCol = '0'.repeat(8 - binaryCol.length) + binaryCol;

    for (var i in binaryCol) {
     newCol.push(new Cell({ active: binaryCol[i] === '1' }));
    }
    decodedColumns.push(newCol);
   }

   return decodedColumns;
  }

  return tracks.map ((t) => {
   t.columns = decodeColumns (t.columns);
   return t;
  });
 }
}
