@Service
public class OtpService {
 private Map<String,OtpDetails> store=new HashMap<>();
 private static final long EXPIRY=5*60*1000;

 public String generate(String email){
  String otp=String.valueOf(100000+(int)(Math.random()*900000));
  store.put(email,new OtpDetails(otp,System.currentTimeMillis()+EXPIRY));
  return otp;
 }

 public String verify(String email,String otp){
  OtpDetails o=store.get(email);
  if(o==null) return "INVALID";
  if(System.currentTimeMillis()>o.getExpiry()) return "EXPIRED";
  return o.getOtp().equals(otp)?"VERIFIED":"INVALID";
 }
}
