import { Controller, Post, Request, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";


@Controller('auth')
@ApiTags('登录')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @UseGuards(AuthGuard('local'))
    @Post('/login')
    @ApiOperation({ summary: '登录' })
    async login(@Request() req) {
        console.error('req-----------------------------------', req);
        return this.authService.login(req.user);
    }

    @UseGuards(AuthGuard('local'))
    @Post('/register')
    @ApiOperation({ summary: '注册' })
    async register(@Request() req) {
        console.error('req', req);
        return this.authService.register(req.user);
    }
}