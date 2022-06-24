import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpRequestService } from '../shared/http-request.service';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {
  constructor(
    private http: HttpClient,
    private httpRequest: HttpRequestService
  ) { }

  //Read the configurations from the API. 
  setDefaultValidators() {
    return this.httpRequest.getRequest('admin/get-global-config');
  }

  //Make every controls in the form group as touched. 
  public markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).map((key) => {
      formGroup.controls[key].markAsTouched();
      formGroup.controls[key].markAsDirty();
      const mayBeFG = formGroup.controls[key] as FormGroup;
      if (mayBeFG.controls) {
        this.markFormGroupTouched(mayBeFG);
      }
    });
  }
}


