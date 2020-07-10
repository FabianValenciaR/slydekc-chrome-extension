import { Component, OnInit } from '@angular/core';
import { faEnvelope, faUser } from '@fortawesome/free-solid-svg-icons';
import { UserService } from 'src/app/services/user.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { FilesService } from 'src/app/services/files.service';

@Component({
  selector: 'app-copy-custom-url',
  templateUrl: './copy-custom-url.component.html',
  styleUrls: ['./copy-custom-url.component.scss']
})
export class CopyCustomUrlComponent implements OnInit {
  localEmail: string;
  aliasGroup: string;
  isEmailValid: boolean = false;
  public faEnvelope = faEnvelope;
  public faUser = faUser;
  public newUrlToken: string;
  public newFileName: string;

  constructor(
    private userService: UserService,
    private copyToast: ToastrManager,
    private filesService: FilesService
  ) {}

  ngOnInit() {}

  validateEmail() {
    const regex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
    this.isEmailValid =
      regex.test(this.localEmail) && regex.exec(this.localEmail)[0] === this.localEmail;
    return this.isEmailValid;
  }

  getFileValues() {
    this.filesService
      .getSelectedFile()
      .then((res) => {
        this.newUrlToken = res.Token;
        this.newFileName = res.Name;
      })
      .catch((error) => {
        this.copyToast.errorToastr("Something went wrong! Please try again.");
      });
  }

  async copyLink() {
    this.validateEmail();
    await this.getFileValues();
    // Encoding Parameters
    let emailEncoded: string = "";
    if(this.localEmail && this.isEmailValid){
      emailEncoded = btoa(this.localEmail);
    }
    let aliasEncoded: string = "";
    if(this.aliasGroup){
      aliasEncoded = btoa(this.aliasGroup);
    }
    // Building append URL with queryParams
    let appendUrl = "";
    if (!this.isEmailValid && this.aliasGroup) {
      appendUrl = `s_code=${aliasEncoded}`;
    } else if (this.aliasGroup && (this.localEmail && this.isEmailValid)) {
      appendUrl = `s_code=${emailEncoded}&a_code=${aliasEncoded}`;
    }
    let generatedLink = `${this.userService.currentDomain}/viewer/${this.newUrlToken}?${appendUrl}`;
    // Creating hidden input to populate the string to copy
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = generatedLink;
    // Executing actions to copy the link
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    this.copyToast.successToastr("The Url was copied to clipboard!");
    document.body.removeChild(selBox);
    this.closeModal();
  }

  closeModal(){
    this.localEmail = "";
    this.aliasGroup = "";
    this.isEmailValid = false;
  }


}
