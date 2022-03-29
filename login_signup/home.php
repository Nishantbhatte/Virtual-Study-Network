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
    <link rel="stylesheet" type="text/css" href="../_vendor/bootstrap/css/bootstrap.min.css">
    <link rel="stylesheet" type="text/css" href="../_fonts/font-awesome-4.7.0/css/font-awesome.min.css">
    <link rel="stylesheet" type="text/css" href="../_vendor/animate/animate.css">
    <link rel="stylesheet" type="text/css" href="../_vendor/css-hamburgers/hamburgers.min.css">
    <link rel="stylesheet" type="text/css" href="../_vendor/select2/select2.min.css">
    <link rel="stylesheet" type="text/css" href="../_css/util.css">
    <link rel="stylesheet" type="text/css" href="../_css/main.css">
    <link rel="stylesheet" type="text/css" href="../_css/login.css">
    <!--===============================================================================================-->

    <title><?php echo $fetch_info['name'] ?> | Home</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    <!-- <link rel="stylesheet" href="../_css/Style_SeOS.css" > -->

    <link rel="stylesheet" href="style_home.css">
</head>

<body>
    <nav class="navbar">
        <a class="menu-item logo-item" href="../index.html">
            <picture>
                <source type="image/png" srcset="../_images/VSN Logo.jpeg">
                <source type="gif" srcset="../_images/VSN Logo.jpeg">
                <img src="../_images/VSN Logo.jpeg" alt="Virtual Study Network">
            </picture>
        </a>
        <!-- <a class="navbar-brand" href="#">Brand name</a> -->
        <div class="login-name">
            <h1>Welcome <?php echo $fetch_info['name'] ?></h1>
        </div>
        <button type="button" class="btn btn-light"><a href="logout-user.php">Logout</a></button>
    </nav>

    <!-- OS List Page, DocStore, Textpad Module -->
    <div class="columns">
        <div class="column1">
            <div class="centered">
                <a href="list_OS.php" class="link"><img class="image-size" src="../_images/os.jpeg" alt="Avatar man" class="link">
                    <h3>Get OS</h3>
                </a>
            </div>  
        </div>

        <div class="column2">
            <div class="centered">
                <a href="../docstore.php" class="link"><img class="image-size" src="../_images/docstore.jpeg" alt="Avatar man" class="link">
                    <h3>DocStore</h3>
                </a>
            </div>
        </div>

        <div class="column3">
            <div class="centered">
                <a href="texteditor.php" class="link"><img class="image-size" src="../_images/textpad1.jpeg" alt="Avatar man" class="link">
                    <h3>TextPad</h3>
                </a>
            </div>
        </div>
    </div>
</body>

</html>