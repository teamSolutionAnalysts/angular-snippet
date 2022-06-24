import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap';
import { CONSTANTS, PAGINATIONDATA } from 'src/app/constants/constant';
import { AdminService } from 'src/app/service/admin/admin.service';
import { NotificationAlertService } from 'src/app/service/shared/notification-alert.service';
import { Utils } from 'src/common/utils';

@Component({
  selector: 'app-admins',
  templateUrl: './admins.component.html',
  styleUrls: ['./admins.component.scss']
})
export class AdminsComponent implements OnInit {

  public users = [];
  public userData: any;
  public curruntField = '';
  public curruntOrder = '';
  public currentLife = false;
  public createdAt = false;
  public searchPlayer = new FormControl('');
  public email = false;
  public balance = false;
  public userName = false;
  public totalItems;
  public rowsOnPage = PAGINATIONDATA.rowsOnPage;
  public currentPage = PAGINATIONDATA.currentPage;
  public maxSize = PAGINATIONDATA.maxSize;
  public modalRef: BsModalRef;
  public config: ModalOptions = { class: 'modal-lg' };
  public searchPlayerFilters: FormGroup;
  @ViewChild('edit_admin', { static: true }) edit_admin: TemplateRef<any>;
  AdminForm: FormGroup;
  adminData: any;
  isCreateForm: boolean;
  isEditForm: boolean;
  constructor(
    private adminService: AdminService,
    private route: Router,
    private notificationService: NotificationAlertService,
    private modalService: BsModalService,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.initializeFilters();
    this.getAdminList();
  }

  public initializeFilters() {
    this.searchPlayerFilters = this.fb.group({
       searchPlayer : new FormControl('')
    });
}

 getAdminList(field?, orderType?) {
   this.isEditForm = false;
   this.isCreateForm = false;
    const isExport = 0;
    this.adminService.getAdminList(this.currentPage - 1, this.rowsOnPage, this.searchPlayerFilters.value.searchPlayer || '', field || '', orderType || '',isExport)
      .subscribe((res: any) => {
        this.users = res.data;
        this.totalItems = res.count;
      }, (err: any) => {
        this.notificationService.showError(err.error.error);
      });
  }

  searchField() {
    this.getAdminList();
  }

  initializeBanner(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, this.config);
  }

  initializeEditAdmin(adminItem){
    this.adminData = adminItem;
    this.initializeEditAdminForm(adminItem);
    this.initializeBanner(this.edit_admin)
  }

  initializeEditAdminForm(adminItem){
    if(adminItem){
      this.isEditForm = true;
      this.isCreateForm = false;
    }else{
      this.isEditForm = false;
      this.isCreateForm = true;
    }
    this.AdminForm = this.fb.group({
      firstName: new FormControl(this.isEditForm ?  adminItem.firstName : '', Validators.required),
      lastName: new FormControl(this.isEditForm ?  adminItem.lastName : '', Validators.required),
      password: new FormControl('',Validators.required),
      userName: new FormControl(this.isEditForm ?  adminItem.userName : '',Validators.required),
      referralCode: new FormControl(this.isEditForm ? adminItem.referralCode : ''),
      email: new FormControl(this.isEditForm ?  adminItem.email : '', [Validators.required,Validators.email])
    });
  }

  updateAdmin(){
    if(this.isCreateForm && !this.isEditForm){
      //call create admin API
      let obj = this.AdminForm.value;
      obj['userRole'] = 'admin'
      this.adminService.createAdmin(this.AdminForm.value)
      .subscribe((res: any) => {
        this.notificationService.showSuccess(res.message)
        this.closeModel();
        this.getAdminList();
      }, (err: any) => {
        this.notificationService.showError(err.error.error);
        this.getAdminList();
      });
    }
  }

  removeSearch() {
    if (this.searchPlayerFilters.value.searchPlayer) {
      this.searchPlayerFilters.controls.searchPlayer.setValue('');
      this.getAdminList();
    }
  }

  pageChanged(event: any): void {
    this.currentPage = event.page;
    this.getAdminList(this.curruntField, this.curruntOrder);
  }

  changeOrder(value, order) {
    this.curruntField = value;
    this.curruntOrder = order;
    this.getAdminList(this.curruntField, this.curruntOrder);
    if (order === 'asc') {
      switch (value) {
        case 'userName':
          this.userName = false;
          break;
        case 'email':
          this.email = false;
          break;
        case 'createdAt':
          this.createdAt = false;
          break;
        default:
          break;
      }
    }
    if (order === 'desc') {
      switch (value) {
        case 'userName':
          this.userName = true;
          break;
        case 'email':
          this.email = true;
          break;
        case 'createdAt':
          this.createdAt = true;
          break;
        default:
          break;
      }
    }
  }


  closeModel() {
    this.modalRef.hide();

 }


}
