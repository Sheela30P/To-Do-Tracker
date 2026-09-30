package com.example.UserAuthentication.controller;

import com.example.UserAuthentication.Exception.UserAlreadyExistsException;
import com.example.UserAuthentication.Exception.UserNotFoundException;
import com.example.UserAuthentication.model.EmailData;
import com.example.UserAuthentication.model.Message;
import com.example.UserAuthentication.model.User;
import com.example.UserAuthentication.service.FileService;
import com.example.UserAuthentication.service.GenerateJwt;
import com.example.UserAuthentication.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@CrossOrigin("*")
@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private GenerateJwt generateJwt;

    @Autowired
    private UserService userService;

    @Autowired
    private FileService fileService;

    @GetMapping("/getUser")
    public ResponseEntity<?> getUser() {
        return new ResponseEntity<>(userService.FindUser(), HttpStatus.OK);
    }


    @PostMapping("/sendOtp")
    public ResponseEntity<?> sendOtp(@RequestParam("email") String email) {
        String response = userService.sendOtp(email);
        return ResponseEntity.ok(response);
    }

    // Endpoint to verify OTP
    @PostMapping("/verifyOtp")
    public ResponseEntity<?> verifyOtp(@RequestParam("email") String email, @RequestParam("otp") String otp) {
        boolean isVerified = userService.verifyOtp(email, otp);
        if (isVerified) {
            return ResponseEntity.ok("OTP verified successfully");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid OTP");
        }
    }

    @PostMapping("/addUser")
    public ResponseEntity<?> addUser(
            @RequestParam("username") String username,
            @RequestParam("usermobile") String mobileNo,
            @RequestParam("email") String email,
            @RequestParam("password") String password,
            @RequestParam("profileImage") MultipartFile profileImage) throws IOException, UserAlreadyExistsException {

        // Save profile image
        String profileImageFileName = fileService.saveProfileImage(profileImage);

        // Create new User object
        User user = new User();
        user.setUserEmail(email);
        user.setMobileNo(mobileNo);
        user.setUserName(username);
        user.setPassword(password);
        user.setProfileImageFileName(profileImageFileName);

        // Add the user
        User newUser = userService.addUser(user);

        // Send signup confirmation email using UserService
        EmailData emailData = new EmailData(email, "Dear " + username + "," +
                "\n" +
                "Welcome to Notelog!\n" +
                "\n" +
                "We’re thrilled to have you on board. Notelog is designed to make managing your tasks and notes easier than ever. With Notelog, you can:\n" +
                "\n" +
                "• Create and organize your notes effortlessly.\n" + "\n" +
                "• Set priorities to ensure you focus on what’s important.\n" +"\n" +
                "• Add due dates and reminders so you never miss a deadline.\n" +"\n" +
                "• Update and track your progress as you go.\n" +"\n" +
                "Whether you're jotting down quick ideas or managing complex projects, Notelog has the tools to help you stay organized and productive.\n" +
                "\n" +
                "We’re excited to see you use these features to their fullest potential. If you have any questions or need assistance, feel free to reach out. We're here to help you make the most of your Notelog experience.\n" +
                "\n" +
                "Happy note-taking and task management!\n" +
                "\n" +
                "Best regards,\n" +
                "The Notelog Team", "NoteLog Signup Successfull");
        String emailResponse = userService.sendEmail(emailData);

        // Return response
        if (emailResponse.contains("Mail sent")) {
            return ResponseEntity.status(HttpStatus.CREATED).body("User created successfully, and email sent.");
        } else {
            return ResponseEntity.status(HttpStatus.CREATED).body("User created successfully, but email failed to send.");
        }
    }


    @GetMapping("/checkEmailExists")
    public ResponseEntity<Map<String, Boolean>> checkEmailExists(@RequestParam String userEmail) {
        boolean exists = userService.emailExists(userEmail);
        Map<String, Boolean> response = new HashMap<>();
        response.put("exists", exists);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/updateUser")
    public ResponseEntity<?> updateUser(
            @RequestParam("userName") String username,      // Match with frontend field
            @RequestParam("mobileNo") String mobileNo,      // Match with frontend field
            @RequestParam("userEmail") String email,        // Match with frontend field
            @RequestPart(value = "profilePicture", required = false) MultipartFile profileImage  // Match with frontend field, allow optional
    ) throws IOException, UserNotFoundException {

        // Handle file upload (check if file is present)
        String profileImageFileName = (profileImage != null) ? fileService.saveProfileImage(profileImage) : null;

        // Fetch the current user from the database (assuming userService.findByEmail)
        User currentUser = userService.findByEmail(email);

        // Update user fields
        currentUser.setUserEmail(email);
        currentUser.setMobileNo(mobileNo);
        currentUser.setUserName(username);
        if (profileImageFileName != null) {
            currentUser.setProfileImageFileName(profileImageFileName);  // Update only if the image is present
        }

        // Update user in the database
        User updatedUser = userService.updateUser(currentUser);

        // Regenerate the JWT with updated user details
        Map<String, String> tokenResponse = generateJwt.genrateToken(updatedUser);
        System.out.println("Updating user with email: " + email);

        // Return the new JWT token along with the updated user information
        return ResponseEntity.ok(tokenResponse);
    }

    @PostMapping("/loginCheck")
    public ResponseEntity<?> loginCheck(@RequestBody User user) {
        User result = userService.loginCheck(user.getUserEmail(), user.getPassword());
        if (result != null) {
            result.setPassword(null);
            return new ResponseEntity<>(generateJwt.genrateToken(result), HttpStatus.OK);
        } else {
            Message msg = new Message("Error", "Login is Failed");
            return new ResponseEntity<>(msg, HttpStatus.FORBIDDEN);
        }
    }


    @PostMapping("/subscribe")
    public ResponseEntity<User> subscribeUser(@RequestParam String email, @RequestParam String paymentId) throws UserNotFoundException {
        User subscribedUser = userService.subscribeUser(email, paymentId);
        return new ResponseEntity<>(subscribedUser, HttpStatus.OK);
    }

    @PostMapping("/unsubscribe")
    public ResponseEntity<User> unsubscribeUser(@RequestParam String email, @RequestParam String paymentId) throws UserNotFoundException {
        User unsubscribedUser = userService.unsubscribeUser(email, paymentId);
        return new ResponseEntity<>(unsubscribedUser, HttpStatus.OK);
    }

    @PutMapping("/updatePassword")
    public ResponseEntity<?> updatePassword(@RequestParam String userEmail, @RequestParam String newPassword) throws UserNotFoundException {
        // Log the values received to ensure they're being handled correctly
        System.out.println("Received email: " + userEmail);
        System.out.println("Received newPassword: " + newPassword);

        User updatedUser = userService.updatePassword(userEmail, newPassword);
        return new ResponseEntity<>(updatedUser, HttpStatus.OK);
    }

}
