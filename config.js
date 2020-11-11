// CONFIG
// Here you can ADD fields to your form
// ID is mandatory
// interface IField{
// id:string,
// labelText?: string,
// placeholder?: string,
// type?: string,
// required?: boolean,
// isEmail?: boolean,
// min?: number,
// max?: number
// }

// interface IForm{
//     method?: string
//     action: string
//     fields?: Array<IField>
// }

export const config = {
    method: 'post',
    action: 'https://jsonplaceholder.typicode.com/users',
    fields: [
      {
        id: 'username',
        labelText: 'Username',
        placeholder: 'Your Username',
        required: true,
        max: 10,
      },
      {
        id: 'password',
        labelText: 'Password',
        placeholder: 'Password',
        type: 'password',
        required: true,
        min: 6,
        max: 12,
      },
      {
        id: 'email',
        type: 'email',
        labelText: 'Email',
      },
      {
        id: 'emailTypeText',
        labelText: 'Email',
        placeholder: 'input type text',
        isEmail: true,
      },
    ],
  };
