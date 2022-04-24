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
    <link rel="stylesheet" type="text/css" href="../style.css">
    <link rel="stylesheet" href="style_home.css">
    <link rel="stylesheet" href="../_css/listOSstyle.css">

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

    <section class="product-list ">
        <div class="product-container">

            <!--       First Product -->
            <div class="card">
                <div class="content">
                    <!-- <div class="title">Ubuntu</div> -->
                    <div class="image">
                        <img src="../_images/os_photos/ubuntu.jpeg" />
                    </div>
                </div>
                <a href="instance.php">
                    <button class="buy-button details">
                        Start
                    </button></a>
            </div>
            <!-- Second Product -->
            <div class="card">
                <!-- <div class="title">Kali Linux</div> -->
                <div class="image">
                    <img src="../_images/os_photos/kali.jpeg" />
                </div>

                <a href="instance.php">
                    <button class="buy-button details">
                        Start
                    </button></a>
            </div>
            <!--       Third Product -->
            <div class="card">
                <!-- <div class="title">FreeBSD</div> -->
                <div class="image">
                    <img src="../_images/os_photos/redhat.jpeg" />
                </div>
                <a href="instance.php">
                    <button class="buy-button details">
                        Start
                    </button></a>
            </div>
            <!--       Fourth Product -->
            <div class="card">
                <!-- <div class="title">BOSS</div> -->
                <div class="image">
                    <img src="../_images/os_photos/centos.jpeg" />
                </div>
                <!-- <div class="text"> </div> -->
                <a href="instance.php">
                    <button class="buy-button details">
                        Start
                    </button></a>


            </div>
            <!--       Fifth Product -->
            <div class="card">
                <!-- <div class="title">BOSS</div> -->
                <div class="image">
                    <img src="../_images/os_photos/parrot.jpeg" />
                </div>
                <!-- <div class="text"></div> -->

                <a href="instance.php">
                    <button class="buy-button details">
                        Start
                    </button></a>

            </div>
            <!--       Sixth Product -->
            <div class="card">
                <!-- <div class="title">BOSS</div> -->
                <div class="image">
                    <img src="../_images/os_photos/fedora.jpeg" />
                </div>
                <a href="instance.php">
                    <button class="buy-button details">
                        Start
                    </button></a>
            </div>
        </div>



    </section>

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