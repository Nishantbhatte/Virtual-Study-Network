<?php

$data = $_POST;

if (empty($data['name']) ||
    empty($data['username']) ||
    empty($data['email']) ||
    empty($data['mobileno']) ||
    empty($data['password']) ||
    empty($data['confirm_password'])) {
    
    die('Please fill all required fields!');
}

if ($data['password'] !== $data['password_confirm']) {
   die('Password and Confirm password should match!');   
}
if($data['mobileno'] < 1000000000 ||  $data['mobileno'] > 1000000000){
    die('Mobile Number should be of 10 digit!');   

}