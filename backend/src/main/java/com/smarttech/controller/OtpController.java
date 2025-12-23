@RestController
@CrossOrigin
@RequestMapping("/api")
public class OtpController {

 @Autowired OtpService service;
 @Autowired JavaMailSender mail;

 @GetMapping("/send-otp")
 public void send(@RequestParam String email){
  sendOtp(email);
 }

 @GetMapping("/resend-otp")
 public void resend(@RequestParam String email){
  sendOtp(email);
 }

 private void sendOtp(String email){
  String otp=service.generate(email);
  SimpleMailMessage msg=new SimpleMailMessage();
  msg.setTo(email);
  msg.setSubject("Smart Tech OTP");
  msg.setText("Your OTP is "+otp+" (Valid for 5 minutes)");
  mail.send(msg);
 }

 @GetMapping("/verify-otp")
 public String verify(@RequestParam String email,@RequestParam String otp){
  return service.verify(email,otp);
 }
}
