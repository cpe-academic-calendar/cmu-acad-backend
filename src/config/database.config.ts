import { registerAs } from "@nestjs/config";

export default registerAs('database',() => ({
        username: process.env.aws_username,
        password: process.env.password,
        database: process.env.database
}))