import { getInitials } from "@/lib/initials";
import type { UserRef } from "@/types/user-ref";

/** Raw shape of apps/accounts/serializers.py's MinimalUserSerializer. */
export interface UserRefDto {
  id: number;
  first_name: string;
  last_name: string;
  display_name: string;
}

export function toUserRef(dto: UserRefDto): UserRef {
  return {
    id: dto.id,
    firstName: dto.first_name,
    lastName: dto.last_name,
    displayName: dto.display_name,
    initials: getInitials(dto.first_name, dto.last_name, dto.display_name),
  };
}
