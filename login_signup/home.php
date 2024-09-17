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
    <link rel="stylesheet" type="text/css" href="../style.css">
    <link rel="stylesheet" href="style_home.css">
    <link rel="stylesheet" href="../_css/cardStyle.css">
    <!--===============================================================================================-->

    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    <title><?php echo $fetch_info['name'] ?> | Home</title>

</head>

<body>
    <!-- Header Starts Here-->
    <div class="topbar-shim">
        <!-- Google Tag Manager (noscript) -->
        <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-NFV46RC" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
        <!-- End Google Tag Manager (noscript) -->
        <nav class="web-topbar">
            <nav class="navbar" style="height: 60px;">
                <a class="menu-item logo-item" href="../index.html">
                    <picture>
                        <!-- <source type="image/png" srcset="../_images/VSN Logo.jpeg">
                            <source type="gif" srcset="../_images/VSN Logo.jpeg"> -->
                        <img src="../_images/VSN Logo.jpeg" alt="Virtual Study Network">
                    </picture>
                </a>
                <div class="login-name">
                    <h1>Welcome <?php echo $fetch_info['name'] ?> </h1>
                </div>
                <button type="button" class="btn btn-light"><a href="logout-user.php">Logout</a></button>
            </nav>
        </nav>
    </div>
    <!-- Header Part Ends Here -->


    <section>
        <div class="container">
            <div class="card">
                <div class="content">
                    <div class="imgBx">
                        <img src="../_images/os.jpeg">
                    </div>
                    <div class="contentBx">
                        <h3>Get OS<br></h3>
                    </div>
                </div>
                <ul class="sci">
                    <li>
                        <a href="list_OS.php">Select Virtual Machine</a>
                    </li>

                </ul>
            </div>
            <div class="card">
                <div class="content">
                    <div class="imgBx">
                        <img src="../_images/docstore.jpeg">
                    </div>
                    <div class="contentBx">
                        <h3>Document Storage<br></h3>
                    </div>
                </div>
                <ul class="sci">
                    <li>
                        <a href="../docstore.php">Store Documents</a>
                    </li>

                </ul>
            </div>
            <div class="card">
                <div class="content">
                    <div class="imgBx">
                        <img src="../_images/textpad1.jpeg">
                    </div>
                    <div class="contentBx">
                        <h3>TextPad<br><span></span></h3>
                    </div>
                </div>
                <ul class="sci">
                    <li>
                        <a href="texteditor.php">Create Document</a>
                    </li>
                </ul>
            </div>
        </div>

    </section>

</body>

</html>