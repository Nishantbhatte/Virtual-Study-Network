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
<html>

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
    <!--===============================================================================================-->
    <link rel="stylesheet" type="text/css" href="../_vendor/bootstrap/css/bootstrap.min.css">
    <!--===============================================================================================-->
    <link rel="stylesheet" type="text/css" href="../_fonts/font-awesome-4.7.0/css/font-awesome.min.css">
    <!--===============================================================================================-->
    <link rel="stylesheet" type="text/css" href="../_vendor/animate/animate.css">
    <!--===============================================================================================-->
    <link rel="stylesheet" type="text/css" href="../_vendor/css-hamburgers/hamburgers.min.css">
    <!--===============================================================================================-->
    <link rel="stylesheet" type="text/css" href="../_vendor/select2/select2.min.css">
    <!--===============================================================================================-->
    <link rel="stylesheet" type="text/css" href="../_css/util.css">
    <link rel="stylesheet" type="text/css" href="../_css/main.css">
    <link rel="stylesheet" type="text/css" href="../_css/login.css">
    <!--===============================================================================================-->
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
    <ol class="list-color">
        <li class=""><a href="http://localhost:8888/?Connect-to-Windows-instance" target="_blank"> Windows</a></li>
        <li class=""><a href="http://localhost:8888/?Ubuntu-Instance" target="_blank">Ubuntu</a></li>
        <li class=""><a href="http://localhost:8888" target="_blank">RedHat</a></li>
        <li class=""><a href="http://localhost:8888" target="_blank">SUSE Linux</a></li>
        <li class=""><a href="http://localhost:8888" target="_blank">Fedora</a></li>
        <li class=""><a href="http://localhost:8888" target="_blank">Kali</a></li>
        <li class=""><a href="http://localhost:8888" target="_blank">Parrot</a></li>
        <li class=""><a href="http://localhost:8888" target="_blank">CentOS</a></li>
    </ol>
    <!--Footer Starts Here-->
    <footer class="web-footer">
        <div class="wrapper-container-lg footer-content-container">
            <div class="menu-section">
                <ul class="footer-item">
                    <li><span><a href="/">Virtual Study Network</a></span></li>
                    <li>
                        <ul class="social-container">
                            <li>
                                <a id="twitter-footer-icon" target="_blank" href="">
                                    <i class="fa fa-twitter-square" aria-hidden="true"></i>
                                </a>
                            </li>
                            <li>
                                <a id="facebook-footer-icon" target="_blank" href="https://www.facebook.com/shreekunj.variya/">
                                    <i class="fa fa-facebook-square" aria-hidden="true"></i>
                                </a>
                            </li>
                            <li>
                                <a id="linkedin-footer-icon" target="_blank" href="https://www.linkedin.com/in/shreekunj-varia/">
                                    <i class="fa fa-linkedin-square" aria-hidden="true"></i>
                                </a>
                            </li>
                        </ul>
                    </li>
                </ul>
                <ul class="footer-item">
                    <li><span>Resources</span></li>
                    <li><a href="aboutus.html">Features</a></li>
                    <li><a href="howitworks.html">Documentation</a></li>
                    <li><a target="_blank" href="">Blog</a></li>
                    <li><a href="">F.A.Q.</a></li>
                </ul>
                <ul class="footer-item">
                    <li><span>About</span></li>
                    <li><a href="/company">Company &amp; Careers</a></li>
                    <li><a href="/terms-of-services">Terms of Services</a></li>
                    <li><a href="/privacy-policy">Privacy Policy</a></li>
                </ul>
                <ul class="footer-item">
                    <li><span>Contact Us</span></li>
                    <li><a href="/contactus.html">Contact VSN</a></li>
                </ul>
            </div>
        </div>
        <div class="wrapper-container-lg footer-bottom-container">
            <div class="copyright"><span>©</span> <strong>Virtual Study Network </strong>2021</div>
        </div>
    </footer>
    <!-- Footer Ends Here-->
</body>

</html>