import { faker } from '@faker-js/faker';

export default function createUser(){
    return {
        username:faker.internet.userName(),
        email:faker.internet.email(),
        password:"hello1",
        firstName:faker.person.firstName(),
        lastName:faker.person.lastName(),
    }
}