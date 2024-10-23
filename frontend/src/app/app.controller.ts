import { Injectable, Injector, OnInit, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { AuthService } from '@app/shared/services/auth-service';
import { NgxSpinnerService } from "ngx-spinner";
import { User } from '@app/shared/models/user';

@Injectable()
export abstract class AppController implements OnInit, OnDestroy {

  /**
   * User data
   */
  public user!: User;
  public isAdmin: boolean = false;
  public isLoggedIn: boolean = false;

  /**
   * Loading spinner state
   */
  public pageLoading: BehaviorSubject<Boolean> = new BehaviorSubject<Boolean>(true);
  public pageLoading$: Observable<Boolean> = this.pageLoading.asObservable();

  private userSub: Subscription | null = null;
  protected spinner: NgxSpinnerService;

  constructor(
    inject: Injector,
    protected authService: AuthService
  ) {
    this.spinner = inject.get(NgxSpinnerService);
    
    // Subscription to AuthService to get user info and roles
    this.userSub = this.authService.user.subscribe((user: User | null) => {        
      if (user) {
        this.setUser(user);
        this.isAdmin = this.authService.isAdmin();
        this.isLoggedIn = this.authService.isLoggedIn();
      }
    });
  }

  ngOnInit(): void {
    this.showSpinner();
  }

  ngOnDestroy(): void {
    if (this.userSub) {
      this.userSub.unsubscribe();
      this.userSub = null;
    }
  }

  /**
   * Show spinner and set loading state
   */
  public showSpinner(): void {
    this.spinner.show();
    this.pageLoading.next(true);
  }

  /**
   * Hide spinner and clear loading state
   */
  public hideSpinner(): void {
    this.spinner.hide();
    this.pageLoading.next(false);
  }

  /**
   * User methods
   */
  public getUser(): User {
    return this.user;
  }

  public setUser(user: User): void {
    this.user = user;
  }
}
