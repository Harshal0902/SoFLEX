use anchor_lang::prelude::*;

declare_id!("HZ3ddGHQP2zbYm6bWBbE21DHbSD8tAYr3MPN9PTbUR69");

#[program]
mod cnft_vesting {
    use anchor_lang::prelude::*;

    #[state]
    pub struct Vesting {
        pub beneficiary: Pubkey,
        pub total_amount: u64,
        pub start_date: i64,
        pub duration: i64,
        pub withdrawn_amount: u64,
    }

    impl Vesting {
        pub fn new(ctx: Context<Auth>, total_amount: u64, duration: i64) -> ProgramResult {
            if duration <= 0 {
                return Err(ErrorCode::InvalidDuration.into());
            }
            
            let vesting = &mut ctx.accounts.vesting;
            vesting.beneficiary = *ctx.accounts.beneficiary.key;
            vesting.total_amount = total_amount;
            vesting.start_date = Clock::get()?.unix_timestamp;
            vesting.duration = duration;
            vesting.withdrawn_amount = 0;

            Ok(())
        }

        pub fn withdraw(ctx: Context<Withdraw>, amount: u64) -> ProgramResult {
            let vesting = &mut ctx.accounts.vesting;
            let current_time = Clock::get()?.unix_timestamp;

            if current_time < vesting.start_date + vesting.duration {
                return Err(ErrorCode::VestingNotStarted.into());
            }

            let elapsed_time = current_time - vesting.start_date;
            let vested_amount = (vesting.total_amount * elapsed_time as u64) / vesting.duration as u64;
            let available_amount = vested_amount - vesting.withdrawn_amount;

            if amount > available_amount {
                return Err(ErrorCode::InsufficientFunds.into());
            }

            ctx.accounts.token_vault.transfer(ctx.accounts.beneficiary, amount)?;

            vesting.withdrawn_amount += amount;

            Ok(())
        }
    }

    #[error]
    pub enum ErrorCode {
        #[msg("Vesting has not started yet")]
        VestingNotStarted,
        #[msg("Insufficient funds available for withdrawal")]
        InsufficientFunds,
        #[msg("Invalid vesting duration")]
        InvalidDuration,
    }
}

#[derive(Accounts)]
pub struct Auth<'info> {
    #[account(init)]
    pub vesting: ProgramAccount<'info, Vesting>,
    pub beneficiary: AccountInfo<'info>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct Withdraw<'info> {
    #[account(mut)]
    pub vesting: ProgramAccount<'info, Vesting>,
    pub beneficiary: AccountInfo<'info>,
    #[account(mut)]
    pub token_vault: AccountInfo<'info>,
    pub clock: Sysvar<'info, Clock>,
}
