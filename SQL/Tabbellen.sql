USE [Netstat project]
GO

/****** Object:  Table [dbo].[Data]    Script Date: 11/03/2019 9:13:15 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


CREATE TABLE [dbo].[Data](
	[DataID] [int] IDENTITY(1,1) UNIQUE NOT NULL,
	[AccountID] [int] NOT NULL,
	[IPAddr] [varchar](15) NOT NULL,
	[Name] [varchar](50) NULL,
	[DownSpeed] [float] NOT NULL,
	[UpSpeed] [float] NOT NULL,
	[RamUsed] [float] NOT NULL,
	[CPUUsed] [float] NOT NULL,
	[MeasureData] [DateTime] NOT NULL
) ON [PRIMARY]
GO


CREATE TABLE [dbo].[Account](
	[AccountID] [int] IDENTITY(1,1) UNIQUE NOT NULL,
	[Name] [varchar](50) NOT NULL,
	[Firstname] [varchar](50) NOT NULL,
	[Email] [varchar](50) NOT NULL,
	[PasswordHash] [varchar](72) NOT NULL,
	[Activated] [bit] NOT NULL,
	[Linked] [bit] NOT NULL
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[Data]    
ADD CONSTRAINT FK_ACCOUNTID FOREIGN KEY ([AccountID])     
    REFERENCES [dbo].[Account] (AccountID)     
    ON DELETE CASCADE    
    ON UPDATE CASCADE    
;    
GO 




