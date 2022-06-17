import { AuthService } from '../services/index.js';
import { log, } from '../../../high-level/index.js';
import Controller from '../classes/controller.class.js';

class RegisterController extends Controller {
    conName = 'Register';
    successMsg = 'User is registered';
    unSuccessMsg = 'Cannot register!';
    do = async _ => this.result = await AuthService.registration(this.req.body);
}

class ChangePasswordController extends Controller {
    conName = 'Change password';
    successMsg = 'Password changed';
    unSuccessMsg = 'Cannot change password!';
    do = async _ => this.result = await AuthService.changePassword(this.req.body, this.req.user._id, this.req.user.password);
}

class RestoreAccessController extends Controller {
    conName = 'Restore access';
    successMsg = 'Your password has been sent to your mail';
    unSuccessMsg = 'Cannot restore access!';
    do = async _ => this.result = await AuthService.restoreAccess(req.body);
}

class RestorePasswordController extends Controller {
    conName = 'Restore password';
    successMsg = 'Mail sent!';
    unSuccessMsg = 'Cannot restore password!';
    do = async _ => this.result = await AuthService.restorePasswordSimple(req.body);
}

export { RegisterController, ChangePasswordController, RestoreAccessController, RestorePasswordController };
