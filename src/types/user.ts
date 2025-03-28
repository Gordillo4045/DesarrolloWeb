export interface UserData {
    firstName: string;
    lastName: string;
    motherLastName: string;
    birthDate: string;
    curp: string;
    phone: string;
    email: string;
    education: string;
}

export interface FormErrors {
    firstName?: string;
    lastName?: string;
    motherLastName?: string;
    birthDate?: string;
    curp?: string;
    phone?: string;
    email?: string;
    education?: string;
}