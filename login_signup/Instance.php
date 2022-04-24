<?php require_once "controllerUserData.php"; ?>
<?php
$email = $_SESSION['email'];
$password = $_SESSION['password'];
if ($email != false && $password != false) {
  $sql = "SELECT * FROM usertable WHERE email = '$email'";
  $run_Sql = mysqli_query($con, $sql);
  if ($run_Sql) {
    $fetch_info = mysqli_fetch_assoc($run_Sql);
    $status = $fetch_info['status'];
    $code = $fetch_info['code'];
    if ($status == "verified") {
      if ($code != 0) {
        header('Location: reset-code.php');
      }
    } else {
      header('Location: user-otp.php');
    }
  }
} else {
  header('Location: login-user.php');
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />

  <meta name="title" content="VSN | Virtual  Study  Network">
  <meta name="description" content="Get  Your  Own  Virtual  Instance as per your Requirement">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="keywords" content="Virtual Lab, Virtaul Machines, E-learning, 
        online computer, browser virtual machine, Aws, Amazon Virtual Images, Operating System,
        Operating System Images, web app, application, web development, app development, code, create Instance,
        access online Operating System, designer, developer, tool, software, javascript, frontend, UI, design, scaffolding">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <!--===============================================================================================-->
  <link rel="icon" type="image/png" href="../_images/_icons/favicon.ico" />
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.1.3/dist/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">
  <link rel="stylesheet" type="text/css" href="../style.css">

  <title><?php echo $fetch_info['name'] ?> | Instance</title>


  <style>
    .btn-logout {

      background: white;
      color: rgba(255, 255, 255, .88);
      height: 50px;
      display: inline;
      padding: 14px 18px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 700;
      margin: 5px 5px;
      justify-content: space-evenly;

    }

    .btn-logout:hover {
      background: lightgreen;
    }
  </style>
</head>

<body>
  <!-- Header Starts Here-->
  <nav class="topbar-shim" style="background-color:#6665ee;">
    <button type="button" class="btn-logout"><a href="logout-user.php">Logout</a></button>
  </nav>

  <iframe src="http://localhost:8888/" width="100%" height="732px" style="border:1px solid black;">
  </iframe>

</body>

</html>