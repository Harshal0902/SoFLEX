use anchor_lang::prelude::*;

declare_id!("HZ3ddGHQP2zbYm6bWBbE21DHbSD8tAYr3MPN9PTbUR69");

#[program]
mod borrow_program {
    use super::*;

    #[state]
    pub struct Borrowing {
        pub total_borrowed: u64,
        pub total_lent: u64,
    }

    impl Borrowing {
        pub fn initialize(ctx: Context<Initialize>) -> ProgramResult {
            let borrowing = &mut ctx.accounts.borrowing;
            borrowing.total_borrowed = 0;
            borrowing.total_lent = 0;

            Ok(())
        }

        pub fn borrow(ctx: Context<Borrow>, amount: u64) -> ProgramResult {
            let borrowing = &mut ctx.accounts.borrowing;
            borrowing.total_borrowed += amount;

            Ok(())
        }

        pub fn lend(ctx: Context<Lend>, amount: u64) -> ProgramResult {
            let borrowing = &mut ctx.accounts.borrowing;
            borrowing.total_lent += amount;

            Ok(())
        }
    }

    #[error]
    pub enum ErrorCode {
        #[msg("Borrowing amount exceeds available balance")]
        InsufficientBalance,
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = user, space = 8)]
    pub borrowing: ProgramAccount<'info, Borrowing>,
    pub user: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Borrow<'info> {
    #[account(mut)]
    pub borrowing: ProgramAccount<'info, Borrowing>,
    pub user: Signer<'info>,
}

#[derive(Accounts)]
pub struct Lend<'info> {
    #[account(mut)]
    pub borrowing: ProgramAccount<'info, Borrowing>,
    pub user: Signer<'info>,
}