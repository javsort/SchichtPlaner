package com.LIT.auth.model.dto.Req;

import java.util.Set;

import com.LIT.auth.model.entity.Role;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDTO {
    private Long id;

    private String email;

    private String username;

    private String address;

    private String phoneNum;

    private String googleId;

    private Set<Role> roles;
    
}
