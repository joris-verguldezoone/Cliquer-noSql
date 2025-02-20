import mongoose, { Schema, Document } from 'mongoose';

// Interface TypeScript
export interface IClicker extends Document {
  user: mongoose.Schema.Types.ObjectId; // Référence vers User
  click_sum: number;
  upgrades: {
    click_rentability: Upgrade;
    crits: {
      crit_chance: Upgrade;
      crit_multiplier: Upgrade;
    };
    click_per_seconds: Upgrade;
  };
}

interface Upgrade {
  level: number;
  level_max: number;
}

const clickerSchema = new Schema<IClicker>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true }, 
  click_sum: { type: Number, default: 0 },
  upgrades: {
    click_rentability: {
      level: { type: Number, default: 0 },
      level_max: { type: Number, default: 6 },
    },
    crits: {
      crit_chance: {
        level: { type: Number, default: 0 },
        level_max: { type: Number, default: 6 },
      },
      crit_multiplier: {
        level: { type: Number, default: 0 },
        level_max: { type: Number, default: 6 },
      },
    },
    click_per_seconds: {
      level: { type: Number, default: 0 },
      level_max: { type: Number, default: 6 },
    },
  },
});

export const Clicker = mongoose.model<IClicker>('Clicker', clickerSchema);
