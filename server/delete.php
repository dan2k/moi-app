<?php
header('Access-Control-Allow-Origin: *');
$data=file_get_contents('php://input');
$data=(array)json_decode($data);
$filenames=$data['filenames'];
$id=$data['id'];
$uploaddir = "uploads/${id}/";
for($i=0;$i<count($filenames);$i++){
	$filename = $uploaddir.$filenames[$i];
	@unlink($filename);
}

?>