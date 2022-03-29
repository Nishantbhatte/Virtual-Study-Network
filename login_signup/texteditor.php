<?php
session_start();
if(isset($_SESSION['MSG'])){
  echo $_SESSION['MSG'];
  unset($_SESSION['MSG']);
}
if(isset($_POST['submit'])){
    $con=mysqli_connect('localhost','root','','my_db');
    $content=$_POST['editor'];
    $added_on=date('Y-m-d h:i:s');
    $sql="insert into content(content,added_on)values('$content','$added_on')";
    if(mysqli_query($con,$sql)){
      $_SESSION['MSG']='Data inserted';
      header("Location: texteditor.php");
      die();

    }
    //echo "Data Stored";
    else{
      echo "Please Try Again";
    }
}
?>
<script src="../ckeditor/ckeditor.js"></script>
<form  method="post">
  <textarea id="editor" name="editor">
  </textarea>
  <input type="submit" name="submit">
</form>

<script>
  CKEDITOR.replace('editor')
</script>

