<?php
include("config.php");
include("functions.php");
$count="";
$mail_id = $_POST['mail_id'];	
if(isset($_SESSION['member_login']) && !empty($_SESSION['member_login'])){
	$count=0;
}else{
	$query = "select * from member_signup where email='$mail_id'";
	$sql_query = $user->query($query);
	$count  = mysql_num_rows($sql_query);
}
if($count>=0)
{
$payment_option = $_POST['payment_option'];
$policy_owner_last = $_POST['policy_owner_last'];		

$policy_owner_first = $_POST['policy_owner_first'];		

$sex = $_POST['sex'];		

$dateofbirth_main = $_POST['dateofbirth_main'];		

$nationality = $_POST['nationality'];		

$family_description = $_POST['family_description'];		

$expatriation_address = $_POST['expatriation_address'];		

$billing_address = $_POST['billing_address'];		

$Phone = $_POST['Phone'];		

$mobile_phone = $_POST['mobile_phone'];		

	

$skype_id = $_POST['skype_id'];		

$POLICY_AREA = $_POST['POLICY_AREA'];		

$partner_last = $_POST['partner_last'];		

$partner_first = $_POST['partner_first'];		

$partner_sex = $_POST['partner_sex'];		

$partner_age = $_POST['partner_age'];

$more_child = 1;			


for($b=1;$b<TOTALCHILDS;$b++){
	
${"child_".$b."_last"} = $_POST["child_".$b."_last"];		

${"child_".$b."_first"} = $_POST["child_".$b."_first"];		

${"child_".$b."_sex"} = $_POST["child_".$b."_sex"];		

${"child_".$b."_age"} = $_POST["child_".$b."_age"];			

}


if(isset($_POST['first_usd_cover']))
{
$first_usd_cover = "YES";
$first_usd = 1;		
}
else
{
$first_usd_cover ="NO";
$first_usd =0;
}
if(isset($_POST['security_CFE']))
{
$security_CFE = "YES";	
$complementary_social = 1;	
}
else
{
$security_CFE ="NO";
$complementary_social = 0;	
}
$security_CFE_1 = $_POST['security_CFE_1'];		
if(isset($_POST['serenity_cover']))
{
$serenity_cover = "YES";
$active_plan = "SERENITY PLAN";		
}
else
{
$serenity_cover = "NO";	
$active_plan = "ELITE PLAN";
}
if(isset($_POST['top_unlimited']))
{
$top_unlimited = "YES";

}
else
{
$top_unlimited = "NO";	
}
if(isset($_POST['inpatient_modules']))
{
$inpatient_modules = "YES";
$inpatient = 1;	
}
else
{
$inpatient_modules = "NO";
$inpatient = 0;
}
if(isset($_POST['outpatient_modules']))
{
$outpatient_modules = "YES";
$optatient = 1;
}
else
{
$outpatient_modules = "NO";	
$optatient = 0;
}
if(isset($_POST['dental_optical_modules']))
{
$dental_optical_modules = "YES";
$dental_optical = 1;	
}
else
{
$dental_optical_modules = "NO";	
$dental_optical = 0;
}
if(isset($_POST['assistance_evacuation_modules']))
{
$assistance_evacuation_modules = "YES";
$assistance_evacuation = 1;	
}
else
{
$assistance_evacuation_modules = "NO";
$assistance_evacuation = 0;	
}



$main_insured_height = $_POST['main_insured_height'];		

$main_insured_weight = $_POST['main_insured_weight'];		

$partner_height = $_POST['partner_height'];		

$partner_weight = $_POST['partner_weight'];		




for($b=1;$b<TOTALCHILDS;$b++){

${"child_height_".$b} = $_POST[$b.'_child_height'];		
${"child_weight_".$b} = $_POST[$b.'_child_weight'];		

}


$preexisting_main_insured = $_POST['preexisting_main_insured'];		

$preexisting_main_insured_1 = $_POST['preexisting_main_insured_1'];		

$preexisting_partner = $_POST['preexisting_partner'];		

$preexisting_partner_1 = $_POST['preexisting_partner_1'];		

		

for($b=1;$b<TOTALCHILDS;$b++){

${"preexisting_".$b."_child"} = $_POST["preexisting_".$b."_child"];		
${"preexisting_".$b."_child_1"} = $_POST["preexisting_".$b."_child_1"];		

}	

$date_of_cover = $_POST['date_of_cover'];

$get_date = explode('/',$date_of_cover);		
$my_new_date = $get_date[1].'/'.$get_date[0].'/'.$get_date[2];		
$end_date =  date("d/m/Y", strtotime($my_new_date . " + 365 day"));


$currency = $_POST['currency'];



$adjust_globallimit = $_POST['adjust_globallimit'];
$hospital_adjusment = $_POST['hospital_adjusment'];

$frequency_payment = $_POST['frequency_payment'];

if($frequency_payment=="Annual")
{
$dollar  = $_POST['yearly_1'];
$euro  = $_POST['yearly_2'];
$pound  = $_POST['yearly_3'];	
}
if($frequency_payment=="Quarterly")
{
$dollar  = $_POST['quarterly_1'];
$euro  = $_POST['quarterly_2'];
$pound  = $_POST['quarterly_3'];	
}
if($frequency_payment=="Monthly")
{
$dollar  = $_POST['monthly_1'];
$euro  = $_POST['monthly_2'];
$pound  = $_POST['monthly_3'];	
}

if($frequency_payment=="biannually")
{
$dollar  = $_POST['biannually_1'];
$euro  = $_POST['biannually_2'];
$pound  = $_POST['biannually_3'];	
}
function convertCurrency_form($amount, $from, $to){
	//$data = file_get_contents("https://www.google.com/finance/converter?a=$amount&from=$from&to=$to");
	$data = file_get_contents("https://finance.google.com/finance/converter?a=$amount&from=$from&to=$to&meta=ei%3DrqMeWpnyAcidugSRtIN4");
	preg_match("/<span class=bld>(.*)<\/span>/",$data, $converted);
	$converted = preg_replace("/[^0-9.]/", "", $converted[1]);
	return number_format(round($converted, 3),2);

	//return $converted[1];
}
$GBP_USD = convertCurrency_form("1", "USD", "GBP");		
	$EURO_USD = convertCurrency_form("1", "USD", "EUR");	
// $GBP_USD = currency("USD","GBP",1);
// $EURO_USD = currency("USD","EUR",1);

$points =  $dollar;

if($currency==1)
{
$last_amount = 	$dollar;
}
if($currency==2)
{
$last_amount = 	$euro;
}
if($currency==3)
{
$last_amount = 	$pound;
}



$policy_id =  $_POST['policy_id'];

$transection_id =  $_POST['transaction_id'];

	$broker_id = get_broker_id();

/*$member_query = ("select membership_number from member_signup where email='$mail_id'");
$result=$user->query($member_query);
$query_result = mysql_fetch_array($result);
*/

$membership_number =  $_POST['membership_number'];

$alias_id =  $_POST['alias_id'];
$alias_reason =  'Recuring Payment';

$password =  mt_rand(100000,999999);
$password = get_secure_password($password);

$status = 1;
$date = date('d-m-Y');
$billing_street = $_POST['billing_street'];
$billing_city = $_POST['billing_city'];
$billing_postal = $_POST['billing_postal'];
$billing_country = $_POST['billing_country']; 

$query = ("INSERT INTO application_form_1 (uid, transection_id, membership_number, broker_id, main_first, main_last, main_sex, main_dob, main_height, main_weight, main_detail, family_description, nationality, main_address, bill_address, phone, mobile, e_mail, skype_id, area_cover, first_usd, complementary_social, social_security, active_plan, inpatient, dental_optical, optatient, assistance_evacuation, global_limit, deductible_hospitalization, starting_date, currency, amount, euro_rate, pound_rate, payment_frequency,date) VALUES (null, '".$transection_id."', '".$membership_number."', '".$broker_id."', '".$policy_owner_first."','".$policy_owner_last."','".$sex."','".$dateofbirth_main."','".$main_insured_height."','".$main_insured_weight."','".$preexisting_main_insured_1."','".$family_description."','".$nationality."','".$expatriation_address."','".$billing_address."','".$Phone."','".$mobile_phone."','".$mail_id."','".$skype_id."','".$POLICY_AREA."','".$first_usd."','".$complementary_social."','".$security_CFE_1."','".$active_plan."','".$inpatient."','".$dental_optical."','".$optatient."','".$assistance_evacuation."','".$adjust_globallimit."','".$hospital_adjusment."','".$date_of_cover."','".$currency."', '".$last_amount."','".$EURO_USD."','".$GBP_USD."', '".$frequency_payment."','".$date."')"); 

 $result=$user->query($query);
//exit();
$query_payment = ("insert into policy_transection (uid, transection_id, broker_id, membership_number, policy_id, currency_type, amount, paypal_tid ,payment_status,start_date , end_date, create_date, payment_date) values (null, '".$transection_id."', '".$broker_id."', '".$membership_number."', '".$policy_id."','".$currency."', '".$last_amount."', '', '0', '".$date_of_cover."','".$end_date."','".$date."', '')");
$result_payment=$user->query($query_payment);


	if($payment_option == 'spay'){
		$slimpay_payment = ("insert into slimpay_billing (transaction_id, membership_number, billing_street, billing_city, billing_postal_code, billing_country, cdate) values ('".$transection_id."','".$membership_number."','".$billing_street."','".$billing_city."','".$billing_postal."','".$billing_country."','".$date."')");
$slimpay_billing= $user->query($slimpay_payment);
	}




$query_alias = ("insert into temp_ALIAS_Data (uid, 	transection_id, alias_id, alias_reason, alias_status) values (null, '".$transection_id."', '".$alias_id."','".$alias_reason."','0')");
$alias_payment=$user->query($query_alias);


$points_query = ("insert into points_detail (uid, transection_id, currency_type, amount, points,equaling_usd) values (null, '".$transection_id."', '".$currency."', '".$last_amount."', '".$points."', '".$dollar."')");

$result=$user->query($points_query);

$userData = array();
if(!isset($_SESSION['member_login']) && empty($_SESSION['member_login'])){
$user_info = "INSERT INTO  temp_member_signup ( membership_number, first_name,last_name,phone,skype,email,password) VALUES  ('$membership_number',  '$policy_owner_first', '$policy_owner_last', '$Phone', '$skype_id', '$mail_id', '$password')";

$result=$user->query($user_info);
}
if($family_description != 'Individual')
{
for($i=1; $i<TOTALCHILDS; $i++)
{
if($i==1 or $i==2)
{
$j = CHILD;
	
}	
else
{
$j = EXTRA_CHILD;
		
}
$userData[] = "('null', ".$j.",'$transection_id', '".${"child_".$i."_first"}."', '".${"child_".$i."_last"}."', '".${"child_".$i."_sex"}."', '".${"child_".$i."_age"}."', '".${"child_height_".$i}."', '".${"child_weight_".$i}."', '".${"preexisting_".$i."_child_1"}."')";
}
$values = implode(',', $userData);

$query = ("INSERT INTO application_form_2 (uid, member_types, transaction_id, child_first, child_last, child_sex, child_dob, child_height, child_weight, child_detail) VALUES ('null',".PARTNER.",'$transection_id', '$partner_first', '$partner_last', '$partner_sex', '$partner_age', '$partner_height', '$partner_weight', '$preexisting_partner_1' ), ".$values); 

$result=$user->query($query);
}

mkdir("./pdf_files/$transection_id",0777, true);

copy('./pdf_files/SUMMARY OF COVERS INCLUDING SHARES.pdf', "./pdf_files/$transection_id/SUMMARY OF COVERS INCLUDING SHARES.pdf");

//echo $pdf_file = "./payment-success.php?policy_no=".$transection_id;
//echo $transection_id;
//echo "PDF file is generated successfully!";
//echo form_output($all_variables); 
echo 1;
}else{
	echo 0;
}
?>


