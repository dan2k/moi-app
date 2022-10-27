<?php
header('Access-Control-Allow-Origin: *');
$id=$_GET['id'];
$filename=time();
$uploaddir = "uploads/${id}/";
mkdir($uploaddir);
$ext=pathinfo($_FILES['upload']['name'], PATHINFO_EXTENSION);
$uploadfile = $uploaddir.$filename.'.'.$ext;
$returnArray = array();
if (move_uploaded_file($_FILES['upload']['tmp_name'], $uploadfile)) {
	$returnArray['message']='success';
	$returnArray["uploaded"] = true;
} else {
	$returnArray['message']='failed';
	$returnArray["uploaded"] = false;
}

$returnArray["url"] = "http://localhost/vue3-1/moi-app/server/".$uploadfile;
//$returnArray["url"] = "../../server/".$uploadfile;
header('Content-type: application/json');
echo json_encode($returnArray);

?>