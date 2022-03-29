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
    <link rel="icon" type="image/png" href="../_images/icons/favicon.ico" />
    <!--===============================================================================================
    <link rel="stylesheet" type="text/css" href="../_vendor/bootstrap/css/bootstrap.min.css">
   <link rel="stylesheet" type="text/css" href="../_fonts/font-awesome-4.7.0/css/font-awesome.min.css">
    <link rel="stylesheet" type="text/css" href="../_vendor/animate/animate.css">
   <link rel="stylesheet" type="text/css" href="../_vendor/css-hamburgers/hamburgers.min.css">
    <link rel="stylesheet" type="text/css" href="../_vendor/select2/select2.min.css">
    ===============================================================================================-->
    <link rel="stylesheet" type="text/css" href="../_css/util.css">
    <link rel="stylesheet" type="text/css" href="../_css/main.css">
    <link rel="stylesheet" type="text/css" href="../_css/login.css">
    <!--===============================================================================================-->

    <title><?php echo $fetch_info['name'] ?> | Home</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    <!-- <link rel="stylesheet" href="../_css/Style_SeOS.css" > -->

    <style>
        @import url('https://fonts.googleapis.com/css?family=Poppins:400,500,600,700&display=swap');

        nav {
            padding-left: 100px !important;
            padding-right: 100px !important;
            background: #6665ee;
            font-family: 'Poppins', sans-serif;
        }

        nav a.navbar-brand {
            color: #fff;
            font-size: 30px !important;
            font-weight: 500;
        }

        button a {
            color: #6665ee;
            font-weight: 500;
        }

        button a:hover {
            text-decoration: none;
        }

        .logo-item {
            font-size: 25px
        }

        a.menu-item {
            height: 60px;
            color: #000000;
        }

        .menu-item-highlight:hover {
            background: #31e249
        }

        .logo-item img {
            padding-top: 2px;
            padding-bottom: 2px;
            max-height: 100%
        }

        /* h1{
        position: absolute;
        top: 50%;
        left: 50%;
        width: 100%;
        text-align: center;
        transform: translate(-50%, -50%);
        font-size: 50px;
        font-weight: 600;
    } */


        .link {
            font-family: Arial;
            color: white;
            text-decoration: none;
        }

        a.link:hover {
            font-size: 120%;
        }

        .image-size {
            width: 250px;
        }

        .centered {
            margin: 0 auto;
        }

        .columns {
            background: linear-gradient(0.25turn, #3f87a6, #ebf8e1, #f69d3c);
        }

        .column1 {
            padding: 8px 0;
            text-align: center;
            background-color: #333;
            width: 500px;
            margin: 0 auto;
        }

        .column2 {
            padding: 8px 0;
            text-align: center;
            background-color: #444;
            width: 500px;
            margin: 0 auto;
        }

        .column3 {
            padding: 8px 0;
            text-align: center;
            background-color: #555;
            width: 500px;
            margin: 0 auto;
        }
    </style>

</head>

<body>
    <nav class="navbar">
        <a class="menu-item logo-item" href="index.html">
            <picture>
                <source type="image/png" srcset="../_images/VSN Logo.jpeg">
                <source type="gif" srcset="../_images/VSN Logo.jpeg">
                <img src="../_images/VSN Logo.jpeg" alt="Virtual Study Network">
            </picture>
        </a>
        <!-- <a class="navbar-brand" href="#">Brand name</a> -->
        <div>
            <h1>Welcome <?php echo $fetch_info['name'] ?></h1>
        </div>
        <button type="button" class="btn btn-light"><a href="logout-user.php">Logout</a></button>
    </nav>

    <!-- OS List Page, DocStore, Textpad Module -->
    <div class="columns">
        <div class="column1">
            <div class="centered">
                <a href="../list_OS.html" class="link"><img class="image-size" src="../_images/os.jpeg" alt="Avatar man" class="link">
                    <h3>Get OS</h3>
                </a>
            </div>
        </div>

        <div class="column2">
            <div class="centered">
                <a href="..//docstore.php" class="link"><img class="image-size" src="../_images/docstore.jpeg" alt="Avatar man" class="link">
                    <h3>DocStore</h3>
                </a>
            </div>
        </div>

        <div class="column3">
            <div class="centered">
                <a href="../texteditor.php" class="link"><img class="image-size" src="../_images/textpad1.jpeg" alt="Avatar man" class="link">
                    <h3>TextPad</h3>
                </a>
            </div>
        </div>
    </div>
</body>

</html>