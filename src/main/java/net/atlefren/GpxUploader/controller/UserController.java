package net.atlefren.GpxUploader.controller;

import net.atlefren.GpxUploader.dao.UserDao;
import net.atlefren.GpxUploader.model.User;
import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;

/**
 * Created by IntelliJ IDEA.
 * User: atle
 * Date: 9/17/11
 * Time: 4:47 PM
 */
@Controller
public class UserController {

        @Resource
    private UserDao userDao;

    @RequestMapping(value = "createMyUser", method = RequestMethod.POST)
    @ResponseBody
    public Boolean registerUser(
            @RequestParam("username") String username,
            @RequestParam("password") String password,
            @RequestParam("password2") String password2,
            @RequestParam("fullname") String fullname,
            @RequestParam("flickrid") String flickrid,
            @RequestParam("email") String email) {
        if(!userDao.userExists(username) && password.length()>7 && !email.equals("") && password.equals(password2)){
                User newUser = new User();
                newUser.setUsername(username);
                newUser.setPassword(DigestUtils.shaHex(password));
                newUser.setFullname(fullname);
                newUser.setEnabled(true);
                newUser.setFlickrId(flickrid);
                newUser.setEmail(email);
                return userDao.saveUser(newUser);
        }
        else {
            return false;
        }
    }


    @RequestMapping(value = "editMyUser", method = RequestMethod.POST)
    @ResponseBody
    public Boolean editUser(
            @RequestParam("fullname") String fullname,
            @RequestParam("flickrid") String flickrid,
            @RequestParam("email") String email) {

            User extuser= (User)SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            User newUser = new User();
            newUser.setId(extuser.getId());
            newUser.setFullname(fullname);
            newUser.setFlickrId(flickrid);
            newUser.setEmail(email);

            userDao.updateUser(newUser);
            extuser.setFlickrId(flickrid);
            extuser.setEmail(email);
            extuser.setFullname(fullname);

            return true;
    }

}
