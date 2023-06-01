// @Injectable()
// export class RoleGuard implements CanActivate {
//   constructor(private readonly reflector: Reflector) {}

//   canActivate(context: ExecutionContext): boolean {
//     const roles = this.reflector.get<string[]>('roles', context.getHandler());
//     if (!roles) {
//       // Se o decorator @Roles não estiver presente, permitir o acesso
//       return true;
//     }

//     const request = context.switchToHttp().getRequest();
//     const userRoles = request.user.roles; // Supondo que as roles estejam disponíveis na propriedade 'roles' do usuário

//     const hasRole = userRoles.some((role) => roles.includes(role));
//     return hasRole;
//   }
// }
