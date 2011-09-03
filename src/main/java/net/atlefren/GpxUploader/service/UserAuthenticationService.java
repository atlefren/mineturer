package net.atlefren.GpxUploader.service;


import net.atlefren.GpxUploader.dao.UserDao;
import net.atlefren.GpxUploader.model.User;
import org.springframework.dao.DataAccessException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;


@Component
public class UserAuthenticationService implements UserDetailsService{
    @Resource
    UserDao userDao;
    /**
     * Locates the user based on the username. In the actual implementation, the search may possibly be case
     * insensitive, or case insensitive depending on how the implementation instance is configured. In this case, the
     * <code>UserDetails</code> object that comes back may have a username that is of a different case than what was
     * actually requested..
     *
     * @param username the username identifying the user whose data is required.
     * @return a fully populated user record (never <code>null</code>)
     * @throws org.springframework.security.core.userdetails.UsernameNotFoundException
     *          if the user could not be found or the user has no GrantedAuthority
     * @throws org.springframework.dao.DataAccessException
     *          if user could not be found for a repository-specific reason
     */
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException, DataAccessException {
        User user = userDao.getUser(username);
        if (user != null) {
            return user;
        }else{
            throw new UsernameNotFoundException(username + " was not found in the database");
        }
    }
}
