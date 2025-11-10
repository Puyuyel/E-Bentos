package com.ebentos.backend.config;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;

public class UsuarioDetails implements UserDetails {
    private final Integer usuarioId;
    private final String email;
    private final String contrasenha;
    private final Collection<? extends GrantedAuthority> authorities;

    public UsuarioDetails(Integer usuarioId, String email, String contrasenha,
                          Collection<? extends GrantedAuthority> authorities) {
        this.usuarioId = usuarioId;
        this.email = email;
        this.contrasenha = contrasenha;
        this.authorities = authorities;
    }

    public Integer getUsuarioId() {
        return usuarioId;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return contrasenha;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}

