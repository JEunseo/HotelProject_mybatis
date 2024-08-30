package com.nc13.Hotel_Spring.service;

import com.nc13.Hotel_Spring.Model.UserDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    private final UserService USER_SERVICE;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    @Autowired
    public UserDetailsServiceImpl(UserService userService, BCryptPasswordEncoder passwordEncoder) {
        USER_SERVICE = userService;
        this.bCryptPasswordEncoder = passwordEncoder;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        System.out.println("username: " + username);
        UserDTO userDTO = USER_SERVICE.selectByUsername(username);
        if (userDTO == null) {
            throw new UsernameNotFoundException(username + "is not a valid username");
        }
        System.out.println("Encoded Password in DB: " + userDTO.getPassword());
        return userDTO;
    }

    public void signup(String username,String password,String nickname,String role){
        System.out.println("UserDetailServiceImpl- "+username+", "+password+", "+nickname+", "+role);
        UserDTO newUser = new UserDTO();
        newUser.setUsername(username);
        newUser.setPassword(bCryptPasswordEncoder.encode(password));
        newUser.setNickname(nickname);
        newUser.setRole(role);
        System.out.println("userDetailsServiceImpl: "+newUser.toString());
        USER_SERVICE.register(newUser);
    }

}
