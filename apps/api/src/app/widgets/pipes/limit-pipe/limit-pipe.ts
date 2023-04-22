import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class LimitPipe implements PipeTransform {
  private readonly minInt: number;
  private readonly maxInt: number;
  private readonly isOptional: boolean = false;
  constructor(minInt: number, maxInt: number, isOptional?: boolean) {
    this.minInt = minInt;
    this.maxInt = maxInt;
    if (isOptional != null) {
      this.isOptional = isOptional;
    }
  }
  transform(value: number | undefined, metadata: ArgumentMetadata) {
    if (this.isOptional && value == null) {
      return value;
    }

    if (!this.isOptional && value == null) {
      throw new BadRequestException(`${metadata.data} must be a number conforming to the specified constraints`);
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    if (value! < this.minInt) {
      throw new BadRequestException(`${metadata.data} must not be less than ${this.minInt}`);
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    if (value! > this.maxInt) {
      throw new BadRequestException(`${metadata.data} must not be greater than ${this.maxInt}`);
    }

    return value;
  }
}