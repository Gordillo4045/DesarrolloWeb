import React from "react";
import { CalendarDate, parseDate } from "@internationalized/date";
import { UserData } from "../types/user";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Card } from "@heroui/card";
import { Form } from "@heroui/form";
import { DateInput } from "@heroui/date-input";
import { Select, SelectItem } from "@heroui/select";
import { addToast } from "@heroui/toast";

const EDUCATION_LEVELS = [
  { key: "Primaria", label: "Primaria" },
  { key: "Secundaria", label: "Secundaria" },
  { key: "Preparatoria", label: "Preparatoria" },
  { key: "Universidad", label: "Universidad" },
  { key: "Posgrado", label: "Posgrado" },
];

interface RegistrationFormProps {
  onSubmit: (data: UserData) => void;
  initialData?: UserData | null;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = React.useState<UserData>({
    firstName: "",
    lastName: "",
    motherLastName: "",
    birthDate: "",
    curp: "",
    phone: "",
    email: "",
    education: "",
  });

  const [birthDate, setBirthDate] = React.useState<CalendarDate | null>(null);
  const [touched, setTouched] = React.useState<Record<string, boolean>>({
    firstName: false,
    lastName: false,
    motherLastName: false,
    birthDate: false,
    curp: false,
    phone: false,
    email: false,
    education: false
  });
  const [validationErrors, setValidationErrors] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      if (initialData.birthDate) {
        setBirthDate(parseDate(initialData.birthDate));
      }
    }
  }, [initialData]);

  // Validation functions
  const validateName = (value: string): string | null => {
    const trimmed = value.trim();
    if (trimmed === "") return "Campo requerido";
    if (!/^[A-Za-zÀ-ÿ]+(?: [A-Za-zÀ-ÿ]+)*$/.test(trimmed)) {
      return "Solo letras permitidas";
    }
    return null;
  };

  const validateCURP = (value: string): string | null => {
    const trimmed = value.trim();
    if (trimmed === "") return "Campo requerido";
    if (!/^[A-Z0-9]{18}$/.test(trimmed)) {
      return "CURP debe tener 18 caracteres";
    }
    return null;
  };

  const validatePhone = (value: string): string | null => {
    if (!value) return "Campo requerido";
    if (!/^\d{10}$/.test(value)) {
      return "Teléfono debe tener 10 dígitos";
    }
    return null;
  };

  const validateEmail = (value: string): string | null => {
    const trimmed = value.trim();
    if (trimmed === "") return "Campo requerido";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      return "Email inválido (debe tener formato nombre@dominio.com)";
    }
    return null;
  };

  const validateField = (field: string, value: string) => {
    let error = null;
    switch (field) {
      case "firstName":
      case "lastName":
      case "motherLastName":
        error = validateName(value);
        break;
      case "curp":
        error = validateCURP(value);
        break;
      case "phone":
        error = validatePhone(value);
        break;
      case "email":
        error = validateEmail(value);
        break;
      case "education":
        error = !value ? "Nivel de educación requerido" : null;
        break;
      case "birthDate":
        error = !value ? "Fecha de nacimiento requerida" : null;
        break;
    }

    setValidationErrors(prev => ({
      ...prev,
      [field]: error || ""
    }));

    return !error;
  };

  const validateAllFields = () => {
    Object.keys(formData).forEach(field => {
      validateField(field, formData[field as keyof UserData]);
    });
  };

  const touchAllFields = () => {
    const allTouched = Object.keys(formData).reduce((acc, field) => {
      acc[field] = true;
      return acc;
    }, {} as Record<string, boolean>);

    setTouched(allTouched);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    touchAllFields();

    const isValid = Object.keys(formData).every(field =>
      validateField(field, formData[field as keyof UserData])
    );

    if (!isValid) {
      addToast({ title: "Error", description: "Por favor corrija los errores en el formulario", color: "danger" });
      return;
    }

    onSubmit(formData);

    setTimeout(() => {
      setFormData({
        firstName: "",
        lastName: "",
        motherLastName: "",
        birthDate: "",
        curp: "",
        phone: "",
        email: "",
        education: "",
      });
      setBirthDate(null);
      setTouched({});
      setValidationErrors({});
    }, 1000);
  };

  return (
    <Card className="w-full p-6 backdrop-blur-md bg-white/30 dark:bg-black/30 border border-white/20">
      <Form
        onSubmit={handleSubmit}
        className="gap-4 flex flex-col w-full justify-center items-center"
        validationErrors={validationErrors}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          <Input
            label="Nombre"
            placeholder="Ingrese su nombre"
            value={formData.firstName}
            onValueChange={(value: string) => {
              setFormData(prev => ({ ...prev, firstName: value }));
              setTouched(prev => ({ ...prev, firstName: true }));
              validateField("firstName", value);
            }}
            isInvalid={touched.firstName && !!validationErrors.firstName}
            errorMessage={validationErrors.firstName}
            isRequired
            variant="bordered"
          />

          <Input
            label="Apellido Paterno"
            placeholder="Ingrese apellido paterno"
            value={formData.lastName}
            onValueChange={(value: string) => {
              setFormData(prev => ({ ...prev, lastName: value }));
              setTouched(prev => ({ ...prev, lastName: true }));
              validateField("lastName", value);
            }}
            isInvalid={touched.lastName && !!validationErrors.lastName}
            errorMessage={validationErrors.lastName}
            isRequired
            variant="bordered"
          />

          <Input
            label="Apellido Materno"
            placeholder="Ingrese apellido materno"
            value={formData.motherLastName}
            onValueChange={(value: string) => {
              setFormData(prev => ({ ...prev, motherLastName: value }));
              setTouched(prev => ({ ...prev, motherLastName: true }));
              validateField("motherLastName", value);
            }}
            isInvalid={touched.motherLastName && !!validationErrors.motherLastName}
            errorMessage={validationErrors.motherLastName}
            isRequired
            variant="bordered"
          />

          <DateInput
            label="Fecha de Nacimiento"
            value={birthDate}
            onChange={(date: CalendarDate | null) => {
              setBirthDate(date || null);
              setFormData(prev => ({ ...prev, birthDate: date?.toString() || "" }));
              setTouched(prev => ({ ...prev, birthDate: true }));
              validateField("birthDate", date?.toString() || "");
            }}
            isInvalid={touched.birthDate && !!validationErrors.birthDate}
            errorMessage={validationErrors.birthDate}
            isRequired
            variant="bordered"
          />

          <Input
            label="CURP"
            placeholder="Ingrese su CURP"
            value={formData.curp}
            onValueChange={(value: string) => {
              const upperValue = value.toUpperCase();
              setFormData(prev => ({ ...prev, curp: upperValue }));
              setTouched(prev => ({ ...prev, curp: true }));
              validateField("curp", upperValue);
            }}
            isInvalid={touched.curp && !!validationErrors.curp}
            errorMessage={validationErrors.curp}
            isRequired
            variant="bordered"
          />

          <Input
            label="Teléfono"
            placeholder="Ingrese su teléfono"
            value={formData.phone}
            onValueChange={(value: string) => {
              const digitsOnly = value.replace(/\D/g, "");
              setFormData(prev => ({ ...prev, phone: digitsOnly }));
              setTouched(prev => ({ ...prev, phone: true }));
              validateField("phone", digitsOnly);
            }}
            type="tel"
            isInvalid={touched.phone && !!validationErrors.phone}
            errorMessage={validationErrors.phone}
            isRequired
            variant="bordered"
          />
        </div>

        <Input
          label="Correo Electrónico"
          placeholder="Ingrese su correo"
          value={formData.email}
          onValueChange={(value: string) => {
            setFormData(prev => ({ ...prev, email: value }));
            setTouched(prev => ({ ...prev, email: true }));
            validateField("email", value);
          }}
          type="email"
          isInvalid={touched.email && !!validationErrors.email}
          errorMessage={validationErrors.email}
          isRequired
          variant="bordered"
        />

        <Select
          label="Nivel de Estudios"
          placeholder="Seleccione su nivel de estudios"
          selectedKeys={formData.education ? [formData.education] : []}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
            const value = e.target.value;
            setFormData(prev => ({ ...prev, education: value }));
            setTouched(prev => ({ ...prev, education: true }));
            validateField("education", value);
          }}
          isInvalid={touched.education && !!validationErrors.education}
          errorMessage={validationErrors.education}
          isRequired
          variant="bordered"
        >
          {EDUCATION_LEVELS.map((level) => (
            <SelectItem key={level.key} >
              {level.label}
            </SelectItem>
          ))}
        </Select>

        <Button
          type="submit"
          color="secondary"
          className="mt-4 w-full"
          onPress={() => {
            touchAllFields();
            validateAllFields();
          }}
        >
          {initialData ? "Actualizar" : "Registrar"}
        </Button>
      </Form>
    </Card>
  );
};