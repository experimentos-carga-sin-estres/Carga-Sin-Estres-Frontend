import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CargaSinEstresDataService } from 'src/app/services/carga-sin-estres-data.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-company-settings',
  templateUrl: './company-settings.component.html',
  styleUrls: ['./company-settings.component.scss']
})
export class CompanySettingsComponent {
  companySettingsForm: FormGroup;
  errorMessage: string = '';
  id: any;
  company: any;
  servicioIds = [];

  constructor(private fb: FormBuilder, private api: CargaSinEstresDataService, private route: ActivatedRoute, private router: Router, private _snackBar: MatSnackBar) {//private http: HttpClient
    this.companySettingsForm = this.fb.group({
      name: [null],
      email: [null],
      direction: [null],
      phoneNumber: [null],
      password: [null],
      confirmPassword: [null],
      logo: [null],
      servicioIds: [null],
      tic: [null],
      description: [null]
    });

    this.route.pathFromRoot[1].url.subscribe(
      url => {
        this.id = url[1].path;
      }
    ); 

    this.getCompany(this.id);
  }

  ngOnInit(){}

  getCompany(id: any){
    this.api.getCompanyById(id).subscribe(
      (res: any) => 
      {
        this.company = res;
        this.servicioIds = this.company.servicioIds;
      }
    );
  }

  onSubmit(){
    const formData = this.companySettingsForm.value;

    // Verificar si todos los campos son nulos
    const allFieldsAreNull = Object.values(formData).every(value => value === null);

    if (allFieldsAreNull) {
      this._snackBar.open('No hay cambios para guardar', 'Cerrar', {
        duration: 5000, // Duración en milisegundos
      });
      return;
    }

    // Handle checkbox validation
    const services = [];
    const checkboxes = [
      'transporte', 'carga', 'embalaje', 'montaje', 'desmontaje'
    ];

    checkboxes.forEach(checkboxName => {
      const control = this.companySettingsForm.get(checkboxName);
      if (control && control.value) {
        services.push(checkboxName);
      }
    });

    const newCompanySettings={
      name: formData.name,
      email: formData.email,
      direction: formData.direction,
      phoneNumber: formData.phoneNumber,
      password: formData.password,
      logo: formData.logo,
      servicioIds: [],
      tic: formData.tic,
      description: formData.description
    }

    if (formData.password !== null) {
      if (formData.password !== formData.confirmPassword) {
        this._snackBar.open('La contraseña y la confirmación de contraseña no coinciden', 'Cerrar', {
          duration: 5000, // Duración en milisegundos
        });
        return;
      }
    }

    this.api.updateCompany(this.id, newCompanySettings).subscribe(
      (response) => {
        console.log('Respuesta del servidor: ', response);
        this._snackBar.open('Edicion de datos exitoso', 'Cerrar', {
          duration: 2000, // Duración en milisegundos
        });

        setTimeout(() => { location.reload();}, 2000);
      },
      (error) => {
        console.log('Error al actualizar los ajustes: ', error);

        // Mostrar mensaje de error del servidor
        if (error && error.error && error.error.message) {
          this._snackBar.open(`${error.error.message}`, 'Cerrar', {
            duration: 5000, // Duración en milisegundos
          });
        } else {
          this._snackBar.open('Error desconocido del servidor', 'Cerrar', {
            duration: 5000, // Duración en milisegundos
          });
        }
      }
    );
  }

  cancelar(){
    this.router.navigate(['/company', this.id, 'membership']);
  }

}
