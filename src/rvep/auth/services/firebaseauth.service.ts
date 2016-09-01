import { Injectable } from '@angular/core';
import { AngularFire, FirebaseAuthState } from 'angularfire2';

import { FirebaseUser } from '../models/firebaseuser.model';
import { FirebaseAuthModel } from '../models/firebaseauth.model';
import { VerifyAuthService } from './verifyauth.service';

@Injectable()
export class FirebaseAuthService {
    // vars
    private _fbAuthModel:FirebaseAuthModel;
    private _fbUser:FirebaseUser;
    private _authFlag:boolean = true;

    // constructor
    constructor(private _verifyAuthService: VerifyAuthService,
                private _af: AngularFire) {
        // init vars
        this._fbAuthModel = new FirebaseAuthModel();
        this._fbUser = new FirebaseUser();

        // subscribe to firebase auth
        this._af.auth.subscribe((auth) => {
          if(auth && this._authFlag) {
            // TODO:
            // this is a temporary fix for subscribe
            // being triggered twice
            this._authFlag = false;

            // set fb user
            this._fbUser.uid = auth.google.uid;
            this._fbUser.email = auth.google.email;
            this._fbUser.name = auth.google.displayName;
            this._fbUser.picture = auth.google.photoURL;

            console.log('user signed in');
            console.log('name: ' + this._fbUser.name);

            // set auth state
            this._fbAuthModel.isSignedIn = true;
            // verify
            this._verifyAuthService.verify(auth);
          } else if(auth == null && !this._authFlag) {
            this._authFlag = true;
            console.log('user signed out');
            this._fbAuthModel.isSignedIn = false;
          }
        });
    }

    // signout of google
    public signOut():void {
      this._af.auth.logout();
    }

    // signin
    public signIn():void {
      this._af.auth.login();
    }

    public getCurrentUser():FirebaseUser {
      return this._fbUser;
    }

    // check if user is signed in
    public isUserSignedIn():boolean {
        return this._fbAuthModel.isSignedIn;
    }

}