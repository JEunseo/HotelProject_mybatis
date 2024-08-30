package com.nc13.Hotel_Spring.controller;
import com.nc13.Hotel_Spring.Model.UserDTO;
import com.nc13.Hotel_Spring.service.HotelService;
import com.nc13.Hotel_Spring.service.UserDetailsServiceImpl;
import com.nc13.Hotel_Spring.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.HashMap;
import java.util.Map;

@RestController
public class UserController {
    @Autowired
    private UserService userService;
    @Autowired
    private HotelService hotelService;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsServiceImpl userDetailsService;
    @Autowired
    public UserController(AuthenticationManager authenticationManager, UserDetailsServiceImpl userDetailsService) {
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
    }


    @PostMapping("/user/auth")
    public ResponseEntity<?> authenticateUser(@RequestParam String username, @RequestParam String password) {
//        System.out.println("Raw Password: " + password);
        Authentication authentication = authenticationManager.authenticate(// 사용자 인증
                new UsernamePasswordAuthenticationToken(username, password)
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserDTO userDetails = (UserDTO) userDetailsService.loadUserByUsername(username);
        return ResponseEntity.ok().body(userDetails);// 인증 성공 시 사용자 정보 반환
    }
    @RequestMapping("/user/authSuccess")
    public ResponseEntity<Map<String, Object>> authSuccess(Authentication authentication) {
        System.out.println("login Success");
        Map<String, Object> resultMap = new HashMap<>();
        UserDTO userDTO = (UserDTO) authentication.getPrincipal();

        resultMap.put("result","success");
        resultMap.put("id", userDTO.getId());
        resultMap.put("nickname", userDTO.getNickname());
        resultMap.put("role", userDTO.getRole());

        return ResponseEntity.ok(resultMap);
    }

    @RequestMapping("/user/authFail")
    public ResponseEntity<Map<String, Object>> authFail() {
//        System.out.println("Auth has failed");
        Map<String, Object> resultMap = new HashMap<>();
        resultMap.put("result","fail");

        return ResponseEntity.ok(resultMap);
    }

    @RequestMapping("/user/logOutSuccess")
    public ResponseEntity<Void> logOutSuccess(Authentication authentication) {
//        System.out.println(authentication);
//        System.out.println("log out success");

        return ResponseEntity.ok().build();
    }
    @RequestMapping("/user/register")
    public ResponseEntity<Void> signUpSuccess(String username,String password,String nickname,String role){
        if(userService.selectByUsername(username)!=null){
//            System.out.println("이미 가입된 회원입니다.");
            return ResponseEntity.status(HttpStatus.CONFLICT).build(); //ERROR CODE 409 return
        }else{
            userDetailsService.signup(username,password,nickname,role);
        }
        return ResponseEntity.ok().build();
    }
}
