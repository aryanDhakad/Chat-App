arr = []


function check() {

  var list = $("input[name=li]:checked")
  for (var i = 0; i < list.length; i++) {
    arr.push(list[i].value);
  }



  console.log(arr);
  $("input[name=list]").attr("value", arr)
  arr = [];
}